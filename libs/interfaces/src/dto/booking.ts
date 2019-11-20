import { EscapeRoomDTO } from './escapeRoom';

export interface BookingDTO {
  _id: string;
  startDate: string;
  endDate: string;
  name: string;
  email: string;
  phoneNumber: string;
  escapeRoomId: string;
  status: string;
  participants: number;
  createdAt: string;
  comment?: string;
}

export interface BookingWithEscapeRoomDTO extends BookingDTO {
  escapeRoom: EscapeRoomDTO;
}

export interface CreateBookingDTO {
  startDate: string;
  endDate: string;
  name: string;
  phoneNumber: string;
  email: string;
  participants: number;
  paymentToken?: string;
}
