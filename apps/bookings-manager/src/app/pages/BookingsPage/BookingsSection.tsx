import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { Section } from '../../shared/layout/Section';
import { BookingsList } from '../../shared/components/BookingsList';

const BOOKINGS_PER_PAGE = 10;

interface Props {
  organizationId: string;
  timeZone?: string;
}

export function BookingsSection({ organizationId, timeZone }: Props) {
  const { t } = useI18n();
  const [bookings, setBookings] = React.useState<Booking[]>();
  const [total, setTotal] = React.useState();
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let isCancelled = false;

    api.getOrganizationBookings(organizationId).then(result => {
      if (!isCancelled) {
        setTotal(result.length);
        setBookings(result);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [organizationId, status]);

  return (
    <Section title={t`Bookings`}>
      <BookingsList
        timeZone={timeZone}
        bookings={bookings}
        loading={!bookings}
        page={page}
        setPage={setPage}
        total={total}
        bookingsPerPage={BOOKINGS_PER_PAGE}
      />
    </Section>
  );
}
