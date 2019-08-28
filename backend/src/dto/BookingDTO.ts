import { BookingEntity } from '@app/entities/BookingEntity'
import { omit } from 'ramda'

export type BookingDTO = Omit<BookingEntity, 'escapeRoom'>

export function toBookingDTO(booking: BookingEntity): BookingDTO {
  return omit(['escapeRoom'], booking)
}
