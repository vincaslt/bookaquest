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

const acceptedBooking: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) &&
  booking.status === BookingStatus.Accepted;

const pendingBooking: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) &&
  booking.status === BookingStatus.Pending;

const completedBooking: BookingFilter = weekdayDate => booking =>
  isAfter(new Date(), booking.endDate) && acceptedBooking(weekdayDate)(booking);

const pendingOrAcceptedBooking: BookingFilter = weekdayDate => booking =>
  acceptedBooking(weekdayDate)(booking) || pendingBooking(weekdayDate)(booking);

const getEarningsCalculator: GetEarningsCalculator = bookingFilter => weekdayDate =>
  pipe(
    filter<Booking, 'array'>(bookingFilter(weekdayDate)),
    map(prop('price')),
    sum
  );

export const pendingEarnings = getEarningsCalculator(pendingOrAcceptedBooking);
export const projectedEarnings = getEarningsCalculator(acceptedBooking);
export const completedEarnings = getEarningsCalculator(completedBooking);
