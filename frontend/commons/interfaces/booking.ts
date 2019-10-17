import omit from 'ramda/es/omit'
import { BookingDTO, BookingWithEscapeRoomDTO, CreateBookingDTO } from './dto/booking'
import { EscapeRoom, fromEscapeRoomDTO } from './escapeRoom'

export enum BookingStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Booking = Omit<BookingDTO, 'startDate' | 'endDate' | 'createdAt' | 'status'> & {
  startDate: Date
  endDate: Date
  createdAt: Date
  status: BookingStatus
}

export type BookingWithEscapeRoom = Omit<
  BookingWithEscapeRoomDTO,
  'startDate' | 'endDate' | 'createdAt' | 'escapeRoom' | 'status'
> & {
  startDate: Date
  endDate: Date
  createdAt: Date
  status: BookingStatus
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
    createdAt: new Date(dto.createdAt),
    status: dto.status as BookingStatus
  }
}

export function fromBookingWithEscapeRoomDTO(dto: BookingWithEscapeRoomDTO): BookingWithEscapeRoom {
  return {
    ...dto,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    createdAt: new Date(dto.createdAt),
    status: dto.status as BookingStatus,
    escapeRoom: fromEscapeRoomDTO(dto.escapeRoom)
  }
}

export const toCreateBookingDTO = (escapeRoom: CreateBooking): CreateBookingDTO =>
  omit(['escapeRoomId'], {
    ...escapeRoom,
    startDate: escapeRoom.startDate.toString(),
    endDate: escapeRoom.endDate.toString()
  })
