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

export function UpcomingBookings({
  bookings = [],
  loading,
  timeZone,
  updateBookings,
  escapeRooms,
  onMoreDetails
}: Props) {
  const upcomingBookings = bookings.filter(
    ({ status }) => status === BookingStatus.Accepted
  );

  return (
    <BookingsList
      escapeRooms={escapeRooms}
      timeZone={timeZone}
      bookings={upcomingBookings}
      loading={loading}
      updateBookings={updateBookings}
      onMoreDetails={onMoreDetails}
    />
  );
}
