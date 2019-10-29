import { toBookingDTO, toBookingWithEscapeRoomDTO } from '@app/dto/BookingDTO'
import { CreateBookingDTO } from '@app/dto/CreateBookingDTO'
import { BookingEntity, BookingStatus } from '@app/entities/BookingEntity'
import { EscapeRoomBusinessHoursEntity } from '@app/entities/EscapeRoomBusinessHoursEntity'
import { EscapeRoomEntity, PricingType } from '@app/entities/EscapeRoomEntity'
import { PaymentDetailsEntity } from '@app/entities/PaymentDetailsEntity'
import { isBetween } from '@app/helpers/number'
import { isOrganizationMember } from '@app/helpers/organizationHelpers'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import withQuery from '@app/lib/decorators/withQuery'
import {
  addDays,
  addSeconds,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInMinutes,
  getISODay,
  isAfter,
  setMinutes,
  startOfDay,
  subSeconds
} from 'date-fns'
import { send } from 'micro'
import { get, post, put } from 'microrouter'
import { times } from 'ramda'
import * as Stripe from 'stripe'
import { Between, getRepository, LessThan, MoreThan } from 'typeorm'

const getBooking = withParams(['bookingId'], ({ bookingId }) => async (req, res) => {
  const bookingRepo = getRepository(BookingEntity)

  const booking = await bookingRepo.findOne(bookingId, {
    relations: ['escapeRoom', 'escapeRoom.businessHours']
  })

  if (!booking) {
    return send(res, STATUS_ERROR.NOT_FOUND)
  }

  return send(res, STATUS_SUCCESS.OK, toBookingWithEscapeRoomDTO(booking))
})

const createBooking = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withBody(CreateBookingDTO, dto => async (req, res) => {
    const escapeRoomRepo = getRepository(EscapeRoomEntity)
    const bookingRepo = getRepository(BookingEntity)
    const paymentDetailsRepo = getRepository(PaymentDetailsEntity)

    const escapeRoom = await escapeRoomRepo.findOne(escapeRoomId, { relations: ['organization'] })

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND)
    }

    const invalidInterval = differenceInMinutes(dto.endDate, dto.startDate) !== escapeRoom.interval
    const invalidParticipants = !isBetween(dto.participants, escapeRoom.participants)

    // TODO: validate if starts at timeslot start
    if (invalidInterval || invalidParticipants) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    const dateInterval = Between(addSeconds(dto.startDate, 1), subSeconds(dto.endDate, 1))

    const overlap = await bookingRepo.findOne({
      where: [
        {
          escapeRoomId,
          startDate: dateInterval,
          status: BookingStatus.Accepted
        },
        {
          escapeRoomId,
          endDate: dateInterval,
          status: BookingStatus.Accepted
        }
      ]
    })

    if (overlap) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }
    let status = BookingStatus.Pending

    if (escapeRoom.paymentEnabled) {
      const paymentDetails = await paymentDetailsRepo.findOne({
        where: { organizationId: escapeRoom.organization.id }
      })

      // TODO: log error "payments disabled"
      if (!paymentDetails || !dto.paymentToken) {
        return send(res, STATUS_ERROR.BAD_REQUEST)
      }

      const stripe = new Stripe(paymentDetails.paymentSecretKey)

      await stripe.charges.create({
        amount:
          (escapeRoom.pricingType === PricingType.FLAT
            ? escapeRoom.price
            : dto.participants * escapeRoom.price) * 100,
        currency: 'eur',
        description: 'An example charge', // TODO: give proper name
        source: dto.paymentToken
      })

      status = BookingStatus.Accepted
    }

    const booking = await bookingRepo.save(bookingRepo.create({ ...dto, status, escapeRoomId }))

    return send(res, STATUS_SUCCESS.OK, toBookingDTO(booking))
  })
)

const getAvailability = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withQuery(['from', 'to'], ({ from, to }) => async (req, res) => {
    const dateNow = new Date()
    const fromDay = from && startOfDay(new Date(from))
    const toDay = to && startOfDay(new Date(to))

    if (!fromDay || !toDay || differenceInCalendarDays(toDay, fromDay) > 35) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    const escapeRoomRepo = getRepository(EscapeRoomEntity)
    const bookingRepo = getRepository(BookingEntity)
    const businessHoursEntity = getRepository(EscapeRoomBusinessHoursEntity)

    const escapeRoom = await escapeRoomRepo.findOne(escapeRoomId)

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND)
    }

    const activeBookings = await bookingRepo.find({
      where: {
        escapeRoomId,
        endDate: MoreThan(fromDay),
        startDate: LessThan(toDay),
        status: BookingStatus.Accepted
      }
    })

    const allBusinessHours = await businessHoursEntity.find({
      where: { escapeRoomId }
    })

    const availability = times(day => {
      const date = addDays(fromDay, day)
      const dayOfweek = getISODay(date)
      const businessHours = allBusinessHours.find(({ weekday }) => weekday === dayOfweek)

      if (date < startOfDay(dateNow) || !businessHours) {
        return null
      }

      const [startHour, endHour] = businessHours.hours

      // TODO: calculations are using local timezone, should use escapeRoom's
      const timeslots = times(i => {
        const start = setMinutes(date, startHour * 60 + i * escapeRoom.interval)
        const end = setMinutes(date, startHour * 60 + (i + 1) * escapeRoom.interval)
        return { start, end }
      }, ((endHour - startHour) * 60) / escapeRoom.interval)

      const availableTimeslots = timeslots.filter(
        ({ start, end }) =>
          isAfter(start, dateNow) &&
          activeBookings.every(
            booking =>
              !areIntervalsOverlapping(
                { start, end },
                { start: booking.startDate, end: booking.endDate }
              )
          )
      )

      return { date, availableTimeslots }
    }, differenceInCalendarDays(toDay, fromDay)).filter(Boolean)

    return send(res, STATUS_SUCCESS.OK, availability)
  })
)

const rejectBooking = withAuth(({ userId }) =>
  withParams(['bookingId'], ({ bookingId }) => async (req, res) => {
    const bookingRepo = getRepository(BookingEntity)

    const booking = await bookingRepo.findOne(bookingId, { relations: ['escapeRoom'] })

    if (!booking) {
      return send(res, STATUS_ERROR.NOT_FOUND)
    }

    if (!isOrganizationMember(booking.escapeRoom.organizationId, userId)) {
      return send(res, STATUS_ERROR.FORBIDDEN)
    }

    // TODO: check permissions when implemented
    if (booking.status !== BookingStatus.Pending) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    booking.status = BookingStatus.Rejected

    const savedBooking = await bookingRepo.save(booking)
    // TODO: send email

    return send(res, STATUS_SUCCESS.OK, toBookingDTO(savedBooking))
  })
)

const acceptBooking = withAuth(({ userId }) =>
  withParams(['bookingId'], ({ bookingId }) => async (req, res) => {
    const bookingRepo = getRepository(BookingEntity)

    const booking = await bookingRepo.findOne(bookingId, { relations: ['escapeRoom'] })

    if (!booking) {
      return send(res, STATUS_ERROR.NOT_FOUND)
    }

    if (!isOrganizationMember(booking.escapeRoom.organizationId, userId)) {
      return send(res, STATUS_ERROR.FORBIDDEN)
    }

    // TODO: check permissions when implemented
    if (booking.status !== BookingStatus.Pending) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    booking.status = BookingStatus.Accepted

    const savedBooking = await bookingRepo.save(booking)
    // TODO: send email

    return send(res, STATUS_SUCCESS.OK, toBookingDTO(savedBooking))
  })
)

export default [
  post('/escape-room/:escapeRoomId/booking', createBooking),
  get('/escape-room/:escapeRoomId/availability', getAvailability),
  get('/booking/:bookingId', getBooking),
  put('/booking/:bookingId/reject', rejectBooking),
  put('/booking/:bookingId/accept', acceptBooking)
]
