import { CreateBookingDTO } from '@app/dto/CreateBookingDTO'
import { BookingEntity } from '@app/entities/BookingEntity'
import { STATUS_ERROR, STATUS_SUCCESS } from '@app/lib/constants'
import { withBody } from '@app/lib/decorators/withBody'
import withParams from '@app/lib/decorators/withParams'
import { send } from 'micro'
import { post } from 'microrouter'
import { Between, getRepository } from 'typeorm'

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

    // TODO: also validate if the timeslot itself is valid (working hours, interval, etc.)
    if (overlap) {
      return send(res, STATUS_ERROR.BAD_REQUEST)
    }

    const newBooking = bookingRepo.create({ ...dto, escapeRoomId })
    await bookingRepo.save(newBooking)

    return send(res, STATUS_SUCCESS.OK)
  })
)
export default [post('/escape-room/:escapeRoomId/booking', createBooking)]
