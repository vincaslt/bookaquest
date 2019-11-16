import { omit } from 'ramda';
import { EscapeRoomBusinessHoursEntity } from '../entities/EscapeRoomBusinessHoursEntity';
import { EscapeRoomEntity } from '../entities/EscapeRoomEntity';

export type EscapeRoomBusinessHoursDTO = Omit<
  EscapeRoomBusinessHoursEntity,
  'escapeRoom' | 'escapeRoomId'
>;

export type EscapeRoomDTO = Omit<
  EscapeRoomEntity,
  'organization' | 'bookings' | 'businessHours'
> & {
  businessHours: EscapeRoomBusinessHoursDTO[];
};

export function toEscapeRoomBusinessHoursDTO(
  businessHours: EscapeRoomBusinessHoursEntity
): EscapeRoomBusinessHoursDTO {
  return omit(['escapeRoomId', 'escapeRoom'])(businessHours);
}

export function toEscapeRoomDTO(escapeRoom: EscapeRoomEntity): EscapeRoomDTO {
  return {
    ...omit(['organization', 'bookings', 'businessHours'])(escapeRoom),
    businessHours: escapeRoom.businessHours.map(toEscapeRoomBusinessHoursDTO)
  };
}
