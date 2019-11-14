import { omit } from 'ramda';
import { BookingEntity } from '../entities/BookingEntity';
import { toEscapeRoomDTO, EscapeRoomDTO } from './EscapeRoomDTO';

export type BookingDTO = Omit<BookingEntity, 'escapeRoom'>;
export type BookingWithEscapeRoomDTO = BookingDTO & {
  escapeRoom: EscapeRoomDTO;
};

export function toBookingWithEscapeRoomDTO(
  booking: BookingEntity
): BookingWithEscapeRoomDTO {
  return { ...booking, escapeRoom: toEscapeRoomDTO(booking.escapeRoom) };
}

export function toBookingDTO(booking: BookingEntity): BookingDTO {
  return omit(['escapeRoom'])(booking);
}
