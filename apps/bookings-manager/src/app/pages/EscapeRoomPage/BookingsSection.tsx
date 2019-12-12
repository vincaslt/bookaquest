import * as React from 'react';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { Section } from '../../shared/layout/Section';
import { BookingsList } from '../../shared/components/BookingsList';

const BOOKINGS_PER_PAGE = 10;

interface Props {
  escapeRoomId: string;
  status?: BookingStatus;
  timeZone?: string;
}

// TODO: loading state for long load times when using pagination? Promise race with delay in useLoading?
export function EscapeRoomBookingsList({
  escapeRoomId,
  status,
  timeZone
}: Props) {
  const { t } = useI18n();
  const [bookings, setBookings] = React.useState<Booking[]>();
  const [total, setTotal] = React.useState();
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let isCancelled = false;

    api
      .getEscapeRoomBookings(escapeRoomId, {
        offset: (page - 1) * BOOKINGS_PER_PAGE,
        take: BOOKINGS_PER_PAGE,
        status
      })
      .then(result => {
        if (!isCancelled) {
          setTotal(result.total);
          setBookings(result.bookings);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page, escapeRoomId, status]);

  return (
    <Section title={t`Bookings`}>
      <BookingsList
        timeZone={timeZone}
        bookings={bookings}
        loading={!bookings}
        pagination={{
          onChange: setPage,
          pageSize: BOOKINGS_PER_PAGE,
          current: page,
          total
        }}
      />
    </Section>
  );
}
