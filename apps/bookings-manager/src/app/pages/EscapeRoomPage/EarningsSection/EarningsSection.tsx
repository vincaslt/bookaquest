import * as React from 'react';
import { Section } from '../../../shared/layout/Section';
import { useI18n } from '@bookaquest/utilities';
import { Booking } from '@bookaquest/interfaces';
import { Spin, Button } from 'antd';
import { EarningsChart } from './EarningsChart';
import { Link } from '../../../shared/components/Link';
import { EarningsStats } from './EarningsStats';

interface Props {
  todaysBookings?: Booking[];
  weeklyBookings?: Booking[];
  week: Date;
  onNextWeek: () => void;
  onPrevWeek: () => void;
}

export function EarningsSection({
  todaysBookings,
  weeklyBookings,
  week,
  onNextWeek,
  onPrevWeek
}: Props) {
  const { t } = useI18n();
  const [mode, setMode] = React.useState<'chart' | 'stats'>('stats');

  const toggleMode = () => setMode(mode === 'stats' ? 'chart' : 'stats');

  return (
    <Section
      title={t`Earnings`}
      extra={
        <Link onClick={toggleMode}>
          {mode === 'stats' ? t`Chart` : t`Stats`}
        </Link>
      }
    >
      {!weeklyBookings || !todaysBookings ? (
        <Spin />
      ) : (
        <div className="flex items-center">
          <Button
            className="flex justify-center mr-4"
            shape="circle"
            icon="left"
            onClick={onPrevWeek}
          />
          <div className="flex flex-grow">
            {mode === 'stats' ? (
              <EarningsStats
                todaysBookings={todaysBookings}
                weeklyBookings={weeklyBookings}
                week={week}
              />
            ) : (
              <EarningsChart weeklyBookings={weeklyBookings} week={week} />
            )}
          </div>
          <Button
            className="flex justify-center ml-4"
            shape="circle"
            icon="right"
            onClick={onNextWeek}
          />
        </div>
      )}
    </Section>
  );
}
