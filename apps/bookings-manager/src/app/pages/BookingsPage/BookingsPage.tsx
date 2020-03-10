import { RouteComponentProps, Redirect } from '@reach/router';
import { PageHeader } from 'antd';
import * as React from 'react';
import { useLoading, useI18n } from '@bookaquest/utilities';
import {
  Booking,
  Organization,
  EscapeRoom,
  BookingStatus
} from '@bookaquest/interfaces';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { BookingModal } from '../../shared/components/BookingModal/BookingModal';
import { PrivateRoutes, getUrl } from '../../constants/routes';
import { BookingsSection } from './BookingsSection/BookingsSection';
import { SchedulerSection } from './SchedulerSection';

export function BookingsPage({
  bookingId,
  navigate
}: RouteComponentProps<{ bookingId?: string }>) {
  const { t } = useI18n();
  const { memberships } = useUser();
  const [loading, withLoading] = useLoading(true);
  const [upcomingBookings, setUpcomingBookings] = React.useState<Booking[]>([]);
  const [organization, setOrganization] = React.useState<Organization>();
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);
  const [selectedBookings, setSelectedBookings] = React.useState<Booking[]>([]);

  const membership = React.useMemo(() => memberships?.[0], [memberships]); // TODO: use selected, instead of first one

  console.log('RR #3');

  React.useEffect(() => {
    console.log('REMOUNT');
  }, []);

  React.useEffect(() => {
    console.log('memb', membership);
    if (membership) {
      withLoading(
        Promise.all([
          api.getOrganizationBookings(membership.organization, {
            select: 'upcoming'
          }),
          api.getOrganization(membership.organization),
          api.getEscapeRooms(membership.organization)
        ]).then(([bookings, org, esc]) => {
          setUpcomingBookings(bookings);
          setOrganization(org);
          setEscapeRooms(esc);
        })
      );
    }
  }, []);

  React.useEffect(() => {
    console.log('openBooking', bookingId);
    if (bookingId) {
      // TODO: probably not the best idea to query booking every time separately
      // api.getBooking(bookingId).then(booking => setSelectedBookings([booking]));
    }
  }, [bookingId]);

  const updateBookings = (updatedBookings: Booking[]) => {
    const getUpdated = (booking: Booking) =>
      updatedBookings.find(({ _id }) => _id === booking._id);

    setUpcomingBookings(prev =>
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

  const handleCloseModal = () => {
    setSelectedBookings([]);
    navigate?.(PrivateRoutes.Bookings, { replace: true });
  };

  const handleSelectBookings = (selected: Booking[]) => {
    if (selected.length > 1) {
      setSelectedBookings(selected);
    } else {
      navigate?.(getUrl(PrivateRoutes.Booking, { bookingId: selected[0]._id }));
    }
  };

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = organization?.timezone ?? localTimeZone;

  if (!membership?.organization) {
    return null;
  }

  if (!loading && !escapeRooms.length) {
    return <Redirect noThrow to={PrivateRoutes.EscapeRooms} />;
  }

  return (
    <PageContent
      header={<PageHeader title={t`All Reservations`} />}
      noBackground
    >
      <BookingModal
        visible={selectedBookings.length > 0}
        updateBookings={updateBookings}
        onClose={handleCloseModal}
        selectedBookings={selectedBookings}
        timeZone={timezone}
        escapeRooms={escapeRooms}
      />
      <SchedulerSection
        bookings={upcomingBookings}
        escapeRooms={escapeRooms}
        loading={loading}
        organization={organization}
        onSelectBookings={handleSelectBookings}
      />
      <BookingsSection
        organization={organization}
        loading={loading}
        bookings={upcomingBookings}
        updateBookings={updateBookings}
        escapeRooms={escapeRooms}
        onMoreDetails={booking => handleSelectBookings([booking])}
      />
    </PageContent>
  );
}
