import { List, Pagination } from 'antd';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import { Booking } from '@bookaquest/interfaces';
import { Section } from '../../shared/layout/Section';
import * as api from '../../api/application';

const BOOKINGS_PER_PAGE = 10;

interface Props {
  escapeRoomId: string;
}

// TODO: loading state for long load times? Promise race with delay in useLoading?
export function BookingsSection({ escapeRoomId }: Props) {
  const { t } = useI18n();
  const [bookings, setBookings] = React.useState<Booking[]>();
  const [total, setTotal] = React.useState();
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let isCancelled = false;

    if (escapeRoomId) {
      api
        .getEscapeRoomBookings(escapeRoomId, {
          offset: (page - 1) * BOOKINGS_PER_PAGE,
          take: BOOKINGS_PER_PAGE
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
    }
  }, [page, escapeRoomId]);

  return (
    <Section title={t`Bookings`}>
      <List
        loading={!bookings}
        itemLayout="horizontal"
        dataSource={bookings}
        renderItem={booking => (
          <List.Item>
            <List.Item.Meta
              title={booking.name}
              description={booking.startDate.toLocaleString()}
            />
          </List.Item>
        )}
      />
      {total > BOOKINGS_PER_PAGE && (
        <Pagination
          defaultCurrent={page}
          total={total}
          pageSize={BOOKINGS_PER_PAGE}
          onChange={setPage}
        />
      )}
    </Section>
  );
}
