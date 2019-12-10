import { RouteComponentProps } from '@reach/router';
import { Spin, Button } from 'antd';
import { endOfDay, startOfDay, addWeeks, subDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import * as React from 'react';
import { useLoading, useI18n } from '@bookaquest/utilities';
import {
  Booking,
  Organization,
  EscapeRoom,
  BookingStatus
} from '@bookaquest/interfaces';
import inc from 'ramda/es/inc';
import dec from 'ramda/es/dec';
import { Time } from '@bookaquest/components';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { ResourceScheduler } from '../../shared/components/ResourceScheduler/ResourceScheduler';
import { PendingBookingModal } from './PendingBookingModal';

export function BookingsPage(props: RouteComponentProps) {
  const { t } = useI18n();
  const { memberships } = useUser();
  const [loading, withLoading] = useLoading(true);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [organization, setOrganization] = React.useState<Organization>();
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);
  const [selectedBookings, setSelectedBookings] = React.useState<Booking[]>([]);
  const [weekOffset, setWeekOffset] = React.useState(0);

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
  const handleSelectBooking = (selected: Booking[]) => {
    if (selected.every(({ status }) => status === BookingStatus.Pending)) {
      setSelectedBookings(selected);
    }
  };

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = organization?.timezone ?? localTimeZone;

  const today = new Date();
  const range = {
    start: zonedTimeToUtc(startOfDay(addWeeks(today, weekOffset)), timezone),
    end: zonedTimeToUtc(
      endOfDay(subDays(addWeeks(today, weekOffset + 1), 1)),
      timezone
    )
  };

  return (
    <PageContent>
      <PendingBookingModal
        visible={selectedBookings.length > 0}
        updateBookings={updateBookings}
        onClose={handleCloseModal}
        selectedBookings={selectedBookings}
      />
      {loading ? (
        <Spin />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <span>
              {timezone !== localTimeZone && t`Timezone: ${timezone}`}
            </span>

            <div className="flex items-center">
              <Button
                className="flex justify-center mr-4"
                shape="circle"
                icon="left"
                disabled={weekOffset === 0}
                onClick={() => setWeekOffset(dec)}
              />
              <div>
                <Time
                  type="date"
                  date={[range.start, range.end]}
                  timeZone={timezone}
                />
              </div>

              <Button
                className="flex justify-center ml-4"
                shape="circle"
                icon="right"
                onClick={() => setWeekOffset(inc)}
              />
            </div>
          </div>
          <ResourceScheduler
            range={range}
            onClickEvent={handleSelectBooking}
            baseAvailability={organization?.businessHours}
            timeZone={timezone}
            resources={escapeRooms.map(escapeRoom => ({
              id: escapeRoom._id,
              name: escapeRoom.name,
              availability: escapeRoom.businessHours,
              timeZone: escapeRoom.timezone,
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
