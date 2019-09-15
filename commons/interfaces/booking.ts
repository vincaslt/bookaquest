import omit from 'ramda/es/omit'
import { BookingDTO, BookingWithEscapeRoomDTO, CreateBookingDTO } from './dto/booking'
import { EscapeRoom, fromEscapeRoomDTO } from './escapeRoom'

export type Booking = Omit<BookingDTO, 'startDate' | 'endDate' | 'createdAt'> & {
  startDate: Date
  endDate: Date
  createdAt: Date
}

export type BookingWithEscapeRoom = Omit<
  BookingWithEscapeRoomDTO,
  'startDate' | 'endDate' | 'createdAt' | 'escapeRoom'
> & {
  startDate: Date
  endDate: Date
  createdAt: Date
  escapeRoom: EscapeRoom
}

export type CreateBooking = Omit<CreateBookingDTO, 'startDate' | 'endDate'> & {
  escapeRoomId: string
  startDate: Date
  endDate: Date
}

export function fromBookingDTO(dto: BookingDTO): Booking {
  return {
    ...dto,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    createdAt: new Date(dto.createdAt)
  }
}

export function fromBookingWithEscapeRoomDTO(dto: BookingWithEscapeRoomDTO): BookingWithEscapeRoom {
  return {
    ...dto,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    createdAt: new Date(dto.createdAt),
    escapeRoom: fromEscapeRoomDTO(dto.escapeRoom)
  }
}

export const toCreateBookingDTO = (escapeRoom: CreateBooking): CreateBookingDTO =>
  omit(['escapeRoomId'], {
    ...escapeRoom,
    startDate: escapeRoom.startDate.toString(),
    endDate: escapeRoom.endDate.toString()
  })
