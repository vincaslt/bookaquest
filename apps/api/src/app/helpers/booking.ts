import { createError } from 'micro';
import { BookingModel } from '../models/Booking';
import { STATUS_ERROR } from '../lib/constants';

export async function requireBooking(bookingId: string) {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Booking not found');
  }
  return booking;
}
