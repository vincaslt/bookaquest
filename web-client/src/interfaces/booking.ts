import { BookingDTO } from './dto/booking'

export type Booking = Omit<BookingDTO, 'startDate' | 'endDate' | 'createdAt'> & {
  startDate: Date
  endDate: Date
  createdAt: Date
}

export function fromBookingDTO(dto: BookingDTO): Booking {
  return {
    ...dto,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    createdAt: new Date(dto.createdAt)
  }
}
