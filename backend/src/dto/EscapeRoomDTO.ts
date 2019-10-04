import { EscapeRoomBusinessHoursEntity } from '@app/entities/EscapeRoomBusinessHoursEntity'
import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { omit } from 'ramda'

export type EscapeRoomBusinessHoursDTO = Omit<
  EscapeRoomBusinessHoursEntity,
  'escapeRoom' | 'escapeRoomId'
>

export type EscapeRoomDTO = Omit<
  EscapeRoomEntity,
  'organization' | 'bookings' | 'businessHours'
> & {
  businessHours: EscapeRoomBusinessHoursDTO[]
}

export function toEscapeRoomBusinessHoursDTO(
  businessHours: EscapeRoomBusinessHoursEntity
): EscapeRoomBusinessHoursDTO {
  return omit(['escapeRoomId', 'escapeRoom'])(businessHours)
}

export function toEscapeRoomDTO(escapeRoom: EscapeRoomEntity): EscapeRoomDTO {
  return {
    ...omit(['organization', 'bookings', 'businessHours'])(escapeRoom),
    businessHours: escapeRoom.businessHours.map(toEscapeRoomBusinessHoursDTO)
  }
}
