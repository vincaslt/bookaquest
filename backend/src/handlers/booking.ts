import { CreateBookingDTO } from '@app/dto/CreateBookingDTO'
import { BookingEntity } from '@app/entities/BookingEntity'
import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import withQuery from '@app/lib/decorators/withQuery'
import { addDays, areIntervalsOverlapping, isAfter, setMinutes, startOfDay } from 'date-fns'
import { send } from 'micro'
import { get, post } from 'microrouter'
import { times } from 'ramda'
import { Between, getRepository, LessThan, MoreThan } from 'typeorm'

const createBooking = withParams(['escapeRoomId'], ({ escapeRoomId }) =>
  withBody(CreateBookingDTO, dto => async (req, res) => {
    const bookingRepo = getRepository(BookingEntity)

    const overlap = await bookingRepo.findOne({
      where: [
        {
          startDate: Between(dto.startDate, dto.endDate)
        },
        { endDate: Between(dto.startDate, dto.endDate) }
      ]
    })

    // TODO: also validate if the timeslot itself is valid, not just random hours (working hours, interval, etc.)
    if (overlap) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    const newBooking = bookingRepo.create({ ...dto, escapeRoomId })
    await bookingRepo.save(newBooking)

    return send(res, STATUS_SUCCESS.OK)
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
        startDate: LessThan(startOfDay(addDays(bookingDate, 1)))
      }
    })

    const [startHour, endHour] = escapeRoom.workHours

    // TODO: work hours interval of date
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

export default [
  post('/escape-room/:escapeRoomId/booking', createBooking),
  get('/escape-room/:escapeRoomId/availability', getAvailability)
]
