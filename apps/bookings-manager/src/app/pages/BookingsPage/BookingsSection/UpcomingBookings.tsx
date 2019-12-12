import * as React from 'react';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { BookingsList } from '../../../shared/components/BookingsList';

interface Props {
  loading: boolean;
  bookings?: Booking[];
  timeZone?: string;
  updateBookings?: (bookings: Booking[]) => void;
}

export function UpcomingBookings({
  bookings = [],
  loading,
  timeZone,
  updateBookings
}: Props) {
  const upcomingBookings = bookings.filter(
    ({ status }) => status === BookingStatus.Accepted
  );

  return (
    <BookingsList
      timeZone={timeZone}
      bookings={upcomingBookings}
      loading={loading}
      updateBookings={updateBookings}
    />
  );
}
