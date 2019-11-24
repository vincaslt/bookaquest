import * as React from 'react';
import { Statistic } from 'antd';
import { Booking } from '@bookaquest/interfaces';
import { green, blue, orange } from '@ant-design/colors';
import { useI18n } from '@bookaquest/utilities';
import { completedEarnings, pendingEarnings, projectedEarnings } from './utils';

interface Props {
  bookings: Booking[];
}

export function EarningsStats({ bookings }: Props) {
  const { t } = useI18n();

  const now = new Date();
  const earningsToday = completedEarnings(now)(bookings);
  const projectedToday = projectedEarnings(now)(bookings);
  const pendingToday = pendingEarnings(now)(bookings);

  return (
    <div>
      <h3 className="mb-4 font-semibold">{t`Today`}</h3>
      <div className="flex">
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
    </div>
  );
}
