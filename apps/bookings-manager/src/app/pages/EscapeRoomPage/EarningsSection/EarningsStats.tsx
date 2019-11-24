import * as React from 'react';
import { Statistic } from 'antd';
import { Booking } from '@bookaquest/interfaces';
import { green, blue, orange } from '@ant-design/colors';
import { useI18n } from '@bookaquest/utilities';
import {
  isBookingCompleted,
  isBookingAccepted,
  isBookingPending
} from './utils';
import { format, startOfWeek } from 'date-fns';
import pipe from 'ramda/es/pipe';
import prop from 'ramda/es/prop';
import sum from 'ramda/es/sum';
import map from 'ramda/es/map';
import filter from 'ramda/es/filter';
import { endOfWeek } from 'date-fns/esm';

interface Props {
  todaysBookings: Booking[];
  weeklyBookings: Booking[];
  week: Date;
}

export function EarningsStats({ todaysBookings, weeklyBookings, week }: Props) {
  const { t } = useI18n();

  const calculateEarnings = (f: (booking: Booking) => boolean) =>
    pipe(filter<Booking, 'array'>(f), map(prop('price')), sum);

  const earningsToday = calculateEarnings(isBookingCompleted)(todaysBookings);
  const pendingToday = calculateEarnings(isBookingPending)(todaysBookings);
  const projectedToday = calculateEarnings(isBookingAccepted)(todaysBookings);

  const earningsWeekly = calculateEarnings(isBookingCompleted)(weeklyBookings);
  const pendingWeekly = calculateEarnings(isBookingPending)(weeklyBookings);
  const projectedWeekly = calculateEarnings(isBookingAccepted)(weeklyBookings);

  return (
    <div>
      <h3 className="mb-2 font-semibold">{t`Today`}</h3>
      <div className="flex mb-4">
        <Statistic
          className="mr-8"
          title={t`Earned`}
          value={earningsToday}
          precision={2}
          valueStyle={{ color: green[6] }}
          suffix="$"
        />
        <Statistic
          title={t`Projected`}
          className="mr-8"
          value={projectedToday}
          precision={2}
          valueStyle={{ color: blue[6] }}
          suffix="$"
        />
        <Statistic
          title={t`Pending`}
          value={pendingToday}
          precision={2}
          valueStyle={{ color: orange[6] }}
          suffix="$"
        />
      </div>
      <h3 className="mb-2 font-semibold">
        {format(startOfWeek(week), 'MMM d')} -{' '}
        {format(endOfWeek(week), 'MMM d')}
      </h3>
      <div className="flex">
        <Statistic
          className="mr-4"
          title={t`Earned`}
          value={earningsWeekly}
          precision={2}
          valueStyle={{ color: green[6] }}
          suffix="$"
        />
        <Statistic
          title={t`Projected`}
          className="mr-8"
          value={projectedWeekly}
          precision={2}
          valueStyle={{ color: blue[6] }}
          suffix="$"
        />
        <Statistic
          title={t`Pending`}
          value={pendingWeekly}
          precision={2}
          valueStyle={{ color: orange[6] }}
          suffix="$"
        />
      </div>
    </div>
  );
}
