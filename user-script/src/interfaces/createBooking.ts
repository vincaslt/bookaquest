import omit from 'ramda/es/omit'
import { CreateBookingDTO } from './dto/createBooking'

export type CreateBooking = Omit<CreateBookingDTO, 'startDate' | 'endDate'> & {
  escapeRoomId: string
  startDate: Date
  endDate: Date
}

export const toCreateBookingDTO = (escapeRoom: CreateBooking): CreateBookingDTO =>
  omit(['escapeRoomId'], {
    ...escapeRoom,
    startDate: escapeRoom.startDate.toString(),
    endDate: escapeRoom.startDate.toString()
  })
