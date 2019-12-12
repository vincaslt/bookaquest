import * as React from 'react';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { BookingsList } from '../../../shared/components/BookingsList';

interface Props {
  loading: boolean;
  bookings?: Booking[];
  timeZone?: string;
  updateBookings?: (bookings: Booking[]) => void;
}

export function PendingBookings({
  bookings = [],
  loading,
  timeZone,
  updateBookings
}: Props) {
  const pendingBookings = bookings.filter(
    ({ status }) => status === BookingStatus.Pending
  );

  return (
    <BookingsList
      timeZone={timeZone}
      bookings={pendingBookings}
      loading={loading}
      updateBookings={updateBookings}
    />
  );
}
