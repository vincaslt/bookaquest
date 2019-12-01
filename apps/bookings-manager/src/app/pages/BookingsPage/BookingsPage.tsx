import { RouteComponentProps } from '@reach/router';
import { Spin, Button } from 'antd';
import { endOfDay, startOfDay, addWeeks } from 'date-fns';
import * as React from 'react';
import { useLoading } from '@bookaquest/utilities';
import { Booking, Organization, EscapeRoom } from '@bookaquest/interfaces';
import inc from 'ramda/es/inc';
import dec from 'ramda/es/dec';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { ResourceScheduler } from '../../shared/components/ResourceScheduler/ResourceScheduler';
import { PendingBookingModal } from './PendingBookingModal';

export function BookingsPage(props: RouteComponentProps) {
  const popupContainer = React.useRef<HTMLElement>();
  const { memberships } = useUser();
  const [loading, withLoading] = useLoading(true);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [organization, setOrganization] = React.useState<Organization>();
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);
  const [selectedBooking, selectBooking] = React.useState<Booking>();
  const [weekOffset, setWeekOffset] = React.useState(0);

  const today = new Date();
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

    popupContainer.current = document.createElement('div');
    document.body.appendChild(popupContainer.current);
  }, [membership, withLoading]);

  const handleCloseModal = () => selectBooking(undefined);

  return (
    <PageContent>
      {selectedBooking && (
        <PendingBookingModal
          setBookings={setBookings}
          onClose={handleCloseModal}
          booking={selectedBooking}
        />
      )}
      {loading ? (
        <Spin />
      ) : (
        <>
          <div className="flex justify-end">
            <Button
              className="flex justify-center mb-2"
              shape="circle"
              icon="left"
              disabled={weekOffset === 0}
              onClick={() => setWeekOffset(dec)}
            />
            <Button
              className="flex justify-center ml-2 mb-2"
              shape="circle"
              icon="right"
              onClick={() => setWeekOffset(inc)}
            />
          </div>
          <ResourceScheduler
            range={{
              start: startOfDay(addWeeks(today, weekOffset)),
              end: endOfDay(addWeeks(today, weekOffset + 1))
            }}
            baseAvailability={organization?.businessHours}
            resources={escapeRooms.map(escapeRoom => ({
              name: escapeRoom.name,
              availability: escapeRoom.businessHours,
              bookings: bookings.filter(
                booking => booking.escapeRoom === escapeRoom._id
              )
            }))}
          />
        </>
      )}
    </PageContent>
  );
}
