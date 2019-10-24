import { EscapeRoomDTO } from './escapeRoom'

export interface BookingDTO {
  id: string
  startDate: string
  endDate: string
  name: string
  email: string
  phoneNumber: string
  escapeRoomId: string
  status: string
  participants: number
  createdAt: string
  comment: string | null
}

export interface BookingWithEscapeRoomDTO extends BookingDTO {
  escapeRoom: EscapeRoomDTO
}

export interface CreateBookingDTO {
  startDate: string
  endDate: string
  name: string
  phoneNumber: string
  email: string
  participants: number
  paymentToken?: string
}
