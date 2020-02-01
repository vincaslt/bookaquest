import { EscapeRoomDTO } from './escapeRoom';

export interface BookingDTO {
  _id: string;
  startDate: string;
  endDate: string;
  name: string;
  email: string;
  phoneNumber: string;
  escapeRoom: string;
  status: string;
  participants: number;
  createdAt: string;
  price: number;
  currency: string;
  comment?: string;
}

export interface BookingWithEscapeRoomDTO
  extends Omit<BookingDTO, 'escapeRoom'> {
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
