import { Statistic } from 'antd';
import { green } from '@ant-design/colors';
import * as React from 'react';
import { Booking, EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { Time } from '@bookaquest/components';
import { BookingStatusText } from '../BookingStatusText';

interface Props {
  booking: Booking;
  escapeRoom: EscapeRoom;
  timeZone?: string;
}

// TODO: fix timezones for bookings
export function BookingDetails({ booking, escapeRoom, timeZone }: Props) {
  const { t } = useI18n();
  return (
    <>
      <BookingStatusText status={booking.status} />
      <div>todo link: {escapeRoom.name}</div>
      <div>Timezone: {timeZone}</div>
      <div>
        <Time
          date={booking.startDate}
          type={{ format: 'PPPp' }}
          timeZone={timeZone}
        />
      </div>
      <div>
        <Time
          date={booking.endDate}
          type={{ format: 'PPPp' }}
          timeZone={timeZone}
        />
      </div>
      <div>duration {escapeRoom.interval}</div>
      <div>
        participants {booking.participants} / {escapeRoom.participants[1]}
      </div>
      <div>{booking.email}</div>
      <div>{booking._id}</div>
      <div>{booking.phoneNumber}</div>
      <div>
        <Time
          date={booking.createdAt}
          type={{ format: 'PPPp' }}
          timeZone={timeZone}
        />
      </div>
      <Statistic
        className="mr-4"
        title={t`Price`}
        value={booking.price}
        precision={2}
        valueStyle={{ color: green[6] }}
        suffix="$"
      />
    </>
  );
}
