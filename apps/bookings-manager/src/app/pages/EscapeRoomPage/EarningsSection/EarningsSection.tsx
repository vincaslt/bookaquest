import { Spin, Button } from 'antd';
import { addWeeks, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import inc from 'ramda/es/inc';
import dec from 'ramda/es/dec';
import { Booking } from '@bookaquest/interfaces';
import { Section } from '../../../shared/layout/Section';
import { Link } from '../../../shared/components/Link';
import * as api from '../../../api/application';
import { EarningsChart } from './EarningsChart';
import { EarningsStats } from './EarningsStats';

interface Props {
  escapeRoomId: string;
}

export function EarningsSection({ escapeRoomId }: Props) {
  const { t, dateFnsLocale } = useI18n();
  const [mode, setMode] = React.useState<'chart' | 'stats'>('stats');
  const [todaysBookings, setTodaysBookings] = React.useState<Booking[]>();
  const [weeklyBookings, setWeeklyBookings] = React.useState<Booking[]>();
  const [weekOffset, setWeekOffset] = React.useState(0);

  React.useEffect(() => {
    const now = new Date();
    const week = addWeeks(now, weekOffset);

    if (escapeRoomId) {
      api
        .getEscapeRoomBookings(escapeRoomId, {
          from: startOfWeek(week, { locale: dateFnsLocale }),
          to: endOfWeek(week, { locale: dateFnsLocale })
        })
        .then(({ bookings }) => {
          // TODO: show message if total is over 500 about inacurate calculations (pagination limit)
          if (weekOffset === 0) {
            setTodaysBookings(
              bookings.filter(booking => isSameDay(now, booking.endDate))
            );
          }
          setWeeklyBookings(bookings);
        });
    }
  }, [weekOffset, escapeRoomId, dateFnsLocale]);

  const toggleMode = () => setMode(mode === 'stats' ? 'chart' : 'stats');
  const nextWeek = () => setWeekOffset(inc);
  const prevWeek = () => setWeekOffset(dec);

  const week = addWeeks(new Date(), weekOffset);

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
            onClick={prevWeek}
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
            onClick={nextWeek}
          />
        </div>
      )}
    </Section>
  );
}
