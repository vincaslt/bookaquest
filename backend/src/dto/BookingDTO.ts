import { EscapeRoomDTO, toEscapeRoomDTO } from '@app/dto/EscapeRoomDTO'
import { BookingEntity } from '@app/entities/BookingEntity'
import { omit } from 'ramda'

export type BookingDTO = Omit<BookingEntity, 'escapeRoom'>
export type BookingWithEscapeRoomDTO = BookingDTO & {
  escapeRoom: EscapeRoomDTO
}

export function toBookingWithEscapeRoomDTO(booking: BookingEntity): BookingWithEscapeRoomDTO {
  return { ...booking, escapeRoom: toEscapeRoomDTO(booking.escapeRoom) }
}

export function toBookingDTO(booking: BookingEntity): BookingDTO {
  return omit(['escapeRoom'])(booking)
}
