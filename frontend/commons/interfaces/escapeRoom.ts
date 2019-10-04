import { BusinessHours } from './businessHours'
import { CreateEscapeRoomDTO, EscapeRoomDTO } from './dto/escapeRoom'

export type CreateEscapeRoom = Omit<CreateEscapeRoomDTO, 'businessHours'> & {
  businessHours: BusinessHours[]
}

export type EscapeRoom = Omit<EscapeRoomDTO, 'createdAt' | 'updatedAt' | 'businessHours'> & {
  createdAt: Date
  updatedAt: Date
  businessHours: BusinessHours[]
}

export function fromEscapeRoomDTO(dto: EscapeRoomDTO): EscapeRoom {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  }
}
