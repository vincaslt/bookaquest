import { List, Pagination } from 'antd';
import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { Time } from '@bookaquest/components';

interface Props {
  loading: boolean;
  total: number;
  page: number;
  bookingsPerPage: number;
  setPage: (page: number) => void;
  bookings?: Booking[];
  timeZone?: string;
}

export function BookingsList({
  page,
  setPage,
  total,
  bookings,
  timeZone,
  loading,
  bookingsPerPage
}: Props) {
  return (
    <>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={bookings}
        renderItem={booking => (
          <List.Item>
            <List.Item.Meta
              title={booking.name}
              description={
                <>
                  <Time
                    date={booking.startDate}
                    type="date"
                    timeZone={timeZone}
                  />{' '}
                  <Time
                    date={[booking.startDate, booking.endDate]}
                    timeZone={timeZone}
                  />{' '}
                  {booking.status}
                </>
              }
            />
          </List.Item>
        )}
      />
      {total > bookingsPerPage && (
        <Pagination
          defaultCurrent={page}
          total={total}
          pageSize={bookingsPerPage}
          onChange={setPage}
        />
      )}
    </>
  );
}
