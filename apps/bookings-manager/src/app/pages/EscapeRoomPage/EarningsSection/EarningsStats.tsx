import { green, blue, orange } from '@ant-design/colors';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Statistic } from 'antd';
import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import pipe from 'ramda/es/pipe';
import prop from 'ramda/es/prop';
import sum from 'ramda/es/sum';
import map from 'ramda/es/map';
import filter from 'ramda/es/filter';
import {
  isBookingCompleted,
  isBookingAccepted,
  isBookingPending
} from './utils';

interface Props {
  todaysBookings: Booking[];
  weeklyBookings: Booking[];
  week: Date;
}

export function EarningsStats({ todaysBookings, weeklyBookings, week }: Props) {
  const { t, dateFnsLocale } = useI18n();

  const calculateEarnings = (f: (booking: Booking) => boolean) =>
    pipe(filter<Booking, 'array'>(f), map(prop('price')), sum);

  const earningsToday = calculateEarnings(isBookingCompleted)(todaysBookings);
  const pendingToday = calculateEarnings(isBookingPending)(todaysBookings);
  const projectedToday = calculateEarnings(isBookingAccepted)(todaysBookings);

  const earningsWeekly = calculateEarnings(isBookingCompleted)(weeklyBookings);
  const pendingWeekly = calculateEarnings(isBookingPending)(weeklyBookings);
  const projectedWeekly = calculateEarnings(isBookingAccepted)(weeklyBookings);

  const start = format(startOfWeek(week), 'MMM d', { locale: dateFnsLocale });
  const end = format(endOfWeek(week), 'MMM d', { locale: dateFnsLocale });

  return (
    <div className="pl-4 w-full">
      <h3 className="mb-2 font-semibold">{t`Today`}</h3>
      <div className="flex justify-between mb-8">
        <Statistic
          className="mr-4"
          title={t`Earned`}
          value={earningsToday}
          precision={2}
          valueStyle={{ color: green[6] }}
          suffix="$"
        />
        <Statistic
          className="mr-4"
          title={t`Projected`}
          value={projectedToday}
          precision={2}
          valueStyle={{ color: blue[6] }}
          suffix="$"
        />
        <Statistic
          className="mr-4"
          title={t`Pending`}
          value={pendingToday}
          precision={2}
          valueStyle={{ color: orange[6] }}
          suffix="$"
        />
      </div>
      <h3 className="mb-2 font-semibold">{`${start} - ${end}`}</h3>
      <div className="flex justify-between">
        <Statistic
          className="mr-4"
          title={t`Earned`}
          value={earningsWeekly}
          precision={2}
          valueStyle={{ color: green[6] }}
          suffix="$"
        />
        <Statistic
          className="mr-4"
          title={t`Projected`}
          value={projectedWeekly}
          precision={2}
          valueStyle={{ color: blue[6] }}
          suffix="$"
        />
        <Statistic
          className="mr-4"
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
