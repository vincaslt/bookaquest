import { EscapeRoomDTO } from "./escapeRoom";

export interface BookingDTO {
  id: string
  startDate: string
  endDate: string
  name: string
  email: string
  phoneNumber: string
  escapeRoomId: string
  createdAt: string
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
}