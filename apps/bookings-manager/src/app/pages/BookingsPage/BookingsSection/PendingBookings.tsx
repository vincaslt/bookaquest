import * as React from 'react';
import { Booking, BookingStatus, EscapeRoom } from '@bookaquest/interfaces';
import { BookingsList } from '../../../shared/components/BookingsList';

interface Props {
  loading: boolean;
  escapeRooms: EscapeRoom[];
  bookings?: Booking[];
  timeZone?: string;
  updateBookings?: (bookings: Booking[]) => void;
  onMoreDetails: (booking: Booking) => void;
}

export function PendingBookings({
  bookings = [],
  loading,
  timeZone,
  updateBookings,
  escapeRooms,
  onMoreDetails
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
      escapeRooms={escapeRooms}
      onMoreDetails={onMoreDetails}
    />
  );
}
