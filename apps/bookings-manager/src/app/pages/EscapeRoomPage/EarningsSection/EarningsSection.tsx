import { Spin, Button } from 'antd';
import { addWeeks, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import inc from 'ramda/es/inc';
import dec from 'ramda/es/dec';
import { Booking, EscapeRoom } from '@bookaquest/interfaces';
import { Section } from '../../../shared/layout/Section';
import { Link } from '../../../shared/components/Link';
import * as api from '../../../api/application';
import { EarningsChart } from './EarningsChart';
import { EarningsStats } from './EarningsStats';

interface Props {
  escapeRoom?: EscapeRoom;
}

export function EarningsSection({ escapeRoom }: Props) {
  const { t, dateFnsLocale } = useI18n();
  const [mode, setMode] = React.useState<'chart' | 'stats'>('stats');
  const [todaysBookings, setTodaysBookings] = React.useState<Booking[]>();
  const [weeklyBookings, setWeeklyBookings] = React.useState<Booking[]>();
  const [weekOffset, setWeekOffset] = React.useState(0);

  React.useEffect(() => {
    if (!escapeRoom) {
      return;
    }

    const now = zonedTimeToUtc(new Date(), escapeRoom.timezone);
    const week = addWeeks(now, weekOffset);

    api
      .getEscapeRoomBookings(escapeRoom._id, {
        from: zonedTimeToUtc(
          startOfWeek(week, { locale: dateFnsLocale }),
          escapeRoom.timezone
        ),
        to: zonedTimeToUtc(
          endOfWeek(week, { locale: dateFnsLocale }),
          escapeRoom.timezone
        )
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
  }, [weekOffset, escapeRoom, dateFnsLocale]);

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
      {!weeklyBookings || !todaysBookings || !escapeRoom ? (
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
                week={zonedTimeToUtc(week, escapeRoom.timezone)}
                timeZone={escapeRoom.timezone}
              />
            ) : (
              <EarningsChart
                weeklyBookings={weeklyBookings}
                week={zonedTimeToUtc(week, escapeRoom.timezone)}
                timeZone={escapeRoom.timezone}
              />
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
