import { EscapeRoomDTO } from './dto/escapeRoom'

export type EscapeRoom = Omit<EscapeRoomDTO, 'createdAt' | 'updatedAt'> & {
  createdAt: Date
  updatedAt: Date
}

export function fromEscapeRoomDTO(dto: EscapeRoomDTO): EscapeRoom {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  }
}
