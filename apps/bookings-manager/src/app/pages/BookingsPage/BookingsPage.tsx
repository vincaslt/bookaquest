import FullCalendar from '@fullcalendar/react';
import timeGridWeek from '@fullcalendar/timegrid';
import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { useLoading } from '@bookaquest/utilities';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { PendingBookingModal } from './PendingBookingModal';

// TODO: show bookings as resources (per escape room)
export function BookingsPage(props: RouteComponentProps) {
  const popupContainer = React.useRef<HTMLElement>();
  const { memberships } = useUser();
  const [isLoading, withLoading] = useLoading(true);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [selectedBooking, selectBooking] = React.useState<Booking>();

  const membership = memberships?.[0]; // TODO: use selected, instead of first one

  React.useEffect(() => {
    if (membership) {
      withLoading(
        api.getOrganizationBookings(membership.organization).then(setBookings)
      );
    }

    popupContainer.current = document.createElement('div');
    document.body.appendChild(popupContainer.current);
  }, [membership, withLoading]);

  const handleCloseModal = () => selectBooking(undefined);

  return (
    <PageContent>
      {membership && (
        <FullCalendar
          defaultView="timeGridWeek"
          plugins={[timeGridWeek]}
          eventClick={info => selectBooking(info.event.extendedProps.booking)}
          events={{
            events: isLoading
              ? []
              : bookings.map(booking => ({
                  title: booking.name,
                  start: booking.startDate,
                  end: booking.endDate,
                  borderColor: 'rgba(0,0,0,0.8)',
                  textColor: 'rgba(0,0,0,0.8)',
                  backgroundColor: {
                    [BookingStatus.Accepted]: '#b7eb8f',
                    [BookingStatus.Pending]: '#ffe58f',
                    [BookingStatus.Rejected]: '#ffa39e',
                    [BookingStatus.Canceled]: '#ffa39e'
                  }[booking.status],
                  booking
                }))
          }}
        />
      )}
      {selectedBooking && (
        <PendingBookingModal
          setBookings={setBookings}
          onClose={handleCloseModal}
          booking={selectedBooking}
        />
      )}
    </PageContent>
  );
}
