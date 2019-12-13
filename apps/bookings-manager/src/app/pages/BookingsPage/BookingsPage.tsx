import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { useLoading } from '@bookaquest/utilities';
import {
  Booking,
  Organization,
  EscapeRoom,
  BookingStatus
} from '@bookaquest/interfaces';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { BookingModal } from './BookingModal/BookingModal';
import { BookingsSection } from './BookingsSection/BookingsSection';
import { SchedulerSection } from './SchedulerSection';

export function BookingsPage(props: RouteComponentProps) {
  const { memberships } = useUser();
  const [loading, withLoading] = useLoading(true);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [organization, setOrganization] = React.useState<Organization>();
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);
  const [selectedBookings, setSelectedBookings] = React.useState<Booking[]>([]);

  const membership = memberships?.[0]; // TODO: use selected, instead of first one

  React.useEffect(() => {
    if (membership) {
      withLoading(
        Promise.all([
          api.getOrganizationBookings(membership.organization),
          api.getOrganization(membership.organization),
          api.getEscapeRooms(membership.organization)
        ]).then(([bkgs, org, esc]) => {
          setBookings(bkgs);
          setOrganization(org);
          setEscapeRooms(esc);
        })
      );
    }
  }, [membership, withLoading]);

  const updateBookings = (updatedBookings: Booking[]) => {
    const getUpdated = (booking: Booking) =>
      updatedBookings.find(({ _id }) => _id === booking._id);

    setBookings(prev =>
      prev
        .filter(
          booking => getUpdated(booking)?.status !== BookingStatus.Rejected
        )
        .map(booking => {
          const updated = getUpdated(booking);
          return updated?.status === BookingStatus.Accepted ? updated : booking;
        })
    );

    setSelectedBookings(prev =>
      prev.filter(
        booking => getUpdated(booking)?.status !== BookingStatus.Rejected
      )
    );
  };

  const handleCloseModal = () => setSelectedBookings([]);
  const handleSelectBookings = (selected: Booking[]) => {
    if (selected.every(({ status }) => status === BookingStatus.Pending)) {
      setSelectedBookings(selected);
    }
  };

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = organization?.timezone ?? localTimeZone;

  if (!membership?.organization) {
    return null;
  }

  return (
    <PageContent noBackground>
      <BookingModal
        visible={selectedBookings.length > 0}
        updateBookings={updateBookings}
        onClose={handleCloseModal}
        selectedBookings={selectedBookings}
        timeZone={timezone}
      />
      <SchedulerSection
        bookings={bookings}
        escapeRooms={escapeRooms}
        loading={loading}
        organization={organization}
        onSelectBookings={handleSelectBookings}
      />
      <BookingsSection
        loading={loading}
        bookings={bookings}
        updateBookings={updateBookings}
        timeZone={organization?.timezone}
        escapeRooms={escapeRooms}
      />
    </PageContent>
  );
}
