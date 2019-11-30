import { RouteComponentProps } from '@reach/router';
import { startOfDay, endOfDay } from 'date-fns';
import * as React from 'react';
import { useLoading } from '@bookaquest/utilities';
import { Booking, Organization, EscapeRoom } from '@bookaquest/interfaces';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { ResourceScheduler } from '../../shared/components/ResourceScheduler/ResourceScheduler';
import { PendingBookingModal } from './PendingBookingModal';
import { Spin } from 'antd';

export function BookingsPage(props: RouteComponentProps) {
  const popupContainer = React.useRef<HTMLElement>();
  const { memberships } = useUser();
  const [loading, withLoading] = useLoading(true);
  const [, setBookings] = React.useState<Booking[]>([]);
  const [organization, setOrganization] = React.useState<Organization>();
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>();
  const [selectedBooking, selectBooking] = React.useState<Booking>();

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
        escapeRooms && (
          <ResourceScheduler
            baseAvailability={organization?.businessHours}
            resources={escapeRooms.map(escapeRoom => ({
              name: escapeRoom.name,
              availability: escapeRoom.businessHours
            }))}
          />
        )
      )}
    </PageContent>
  );
}
