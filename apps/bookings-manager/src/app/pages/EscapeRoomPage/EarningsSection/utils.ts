import { isSameDay, isAfter } from 'date-fns';
import sum from 'ramda/es/sum';
import prop from 'ramda/es/prop';
import pipe from 'ramda/es/pipe';
import filter from 'ramda/es/filter';
import map from 'ramda/es/map';
import { Booking, BookingStatus } from '@bookaquest/interfaces';

type BookingFilter = (weekdayDate: Date) => (booking: Booking) => boolean;
type EarningsCalculator = (weekdayDate: Date) => (booking: Booking[]) => number;
type GetEarningsCalculator = (
  bookingsFilter: BookingFilter
) => EarningsCalculator;

export const isBookingAccepted = (booking: Booking) =>
  booking.status === BookingStatus.Accepted;
export const isBookingPending = (booking: Booking) =>
  booking.status === BookingStatus.Pending;
export const isBookingCompleted = (booking: Booking) =>
  isAfter(new Date(), booking.endDate) && isBookingAccepted(booking);

const acceptedBookingFilter: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) && isBookingAccepted(booking);

const pendingBookingFilter: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) && isBookingPending(booking);

const completedBookingFilter: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) && isBookingCompleted(booking);

const pendingOrAcceptedBooking: BookingFilter = weekdayDate => booking =>
  acceptedBookingFilter(weekdayDate)(booking) ||
  pendingBookingFilter(weekdayDate)(booking);

const getEarningsCalculator: GetEarningsCalculator = bookingFilter => weekdayDate =>
  pipe(
    filter<Booking, 'array'>(bookingFilter(weekdayDate)),
    map(prop('price')),
    sum
  );

export const pendingEarnings = getEarningsCalculator(pendingOrAcceptedBooking);
export const projectedEarnings = getEarningsCalculator(acceptedBookingFilter);
export const completedEarnings = getEarningsCalculator(completedBookingFilter);
