import { toBookingDTO, toBookingWithEscapeRoomDTO } from '@app/dto/BookingDTO'
import { CreateBookingDTO } from '@app/dto/CreateBookingDTO'
import { BookingEntity, BookingStatus } from '@app/entities/BookingEntity'
import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { isOrganizationMember } from '@app/helpers/organizationHelpers'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withAuth } from '@app/lib/decorators/withAuth'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import withQuery from '@app/lib/decorators/withQuery'
import { addDays, areIntervalsOverlapping, isAfter, setMinutes, startOfDay } from 'date-fns'
import { send } from 'micro'
import { get, post, put } from 'microrouter'
import { times } from 'ramda'
import { Between, getRepository, LessThan, MoreThan } from 'typeorm'

const getBooking = withParams(['bookingId'], ({ bookingId }) => async (req, res) => {
  const bookingRepo = getRepository(BookingEntity)

  const booking = await bookingRepo.findOne(bookingId, { relations: ['escapeRoom'] })

  if (!booking) {
    return send(res, STATUS_ERROR.NOT_FOUND)
  }

  return send(res, STATUS_SUCCESS.OK, toBookingWithEscapeRoomDTO(booking))
})

const createBooking = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withBody(CreateBookingDTO, dto => async (req, res) => {
    const bookingRepo = getRepository(BookingEntity)

    const overlap = await bookingRepo.findOne({
      where: [
        {
          startDate: Between(dto.startDate, dto.endDate),
          status: BookingStatus.Accepted
        },
        {
          endDate: Between(dto.startDate, dto.endDate),
          status: BookingStatus.Accepted
        }
      ]
    })

    // TODO: also validate if the timeslot itself is valid, not just random hours (working hours, interval, etc.)
    if (overlap) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    const booking = await bookingRepo.save(
      bookingRepo.create({ ...dto, status: BookingStatus.Pending, escapeRoomId })
    )

    return send(res, STATUS_SUCCESS.OK, toBookingDTO(booking))
  })
)

const getAvailability = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withQuery(['date'], ({ date }) => async (req, res) => {
    const escapeRoomRepo = getRepository(EscapeRoomEntity)
    const bookingRepo = getRepository(BookingEntity)

    // TODO: Maybe do the check and get bookings with one query?
    const escapeRoom = await escapeRoomRepo.findOne(escapeRoomId)

    if (!escapeRoom) {
      return send(res, STATUS_ERROR.NOT_FOUND)
    }

    const bookingDate = date && new Date(date)

    if (!bookingDate || bookingDate < startOfDay(new Date())) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    const activeBookings = await bookingRepo.find({
      where: {
        escapeRoomId,
        endDate: MoreThan(startOfDay(bookingDate)),
        startDate: LessThan(startOfDay(addDays(bookingDate, 1))),
        status: BookingStatus.Accepted
      }
    })

    const [startHour, endHour] = escapeRoom.workHours

    // TODO: work hours interval of date because need timezone
    const timeslots = times(i => {
      const start = setMinutes(startOfDay(bookingDate), startHour * 60 + i * escapeRoom.interval)
      const end = setMinutes(
        startOfDay(bookingDate),
        startHour * 60 + (i + 1) * escapeRoom.interval
      )
      return { start, end }
    }, ((endHour - startHour) * 60) / escapeRoom.interval)

    const availableTimeslots = timeslots.filter(({ start, end }) => {
      return (
        isAfter(start, new Date()) &&
        activeBookings.every(
          booking =>
            !areIntervalsOverlapping(
              { start, end },
              { start: booking.startDate, end: booking.endDate }
            )
        )
      )
    })

    return send(res, STATUS_SUCCESS.OK, availableTimeslots)
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
export default [
  post('/escape-room/:escapeRoomId/booking', createBooking),
  get('/escape-room/:escapeRoomId/availability', getAvailability),
  get('/booking/:bookingId', getBooking),
  put('/booking/:bookingId/reject', rejectBooking)
]
