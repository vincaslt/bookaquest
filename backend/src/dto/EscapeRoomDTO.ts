import { EscapeRoomEntity } from '@app/entities/EscapeRoomEntity'
import { omit } from 'ramda'

export type EscapeRoomDTO = Omit<EscapeRoomEntity, 'organization' | 'bookings'>

export function toEscapeRoomDTO(escapeRoom: EscapeRoomEntity): EscapeRoomDTO {
  return omit(['organization', 'bookings'], escapeRoom)
}
