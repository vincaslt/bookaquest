import {
  addMonths,
  getMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  endOfMonth,
  eachDayOfInterval
} from 'date-fns';
import { endOfWeek } from 'date-fns/esm';
import { zonedTimeToUtc } from 'date-fns-tz';
import { utcToZonedTime } from 'date-fns-tz/esm';
import splitEvery from 'ramda/es/splitEvery';
import { useI18n } from '@bookaquest/utilities';
import * as React from 'react';
import { Timeslot, Availability } from '@bookaquest/interfaces';
import { Day } from './Day';
import { Header } from './Header';
import { Timeslots } from './Timeslots';

interface Props {
  timeZone: string;
  onSelectTimeslot: (date: Timeslot) => void;
  onSelectDay: (date: Date) => void;
  onMonthChange: (interval: { start: Date; end: Date }) => void;
  timeslot?: Timeslot;
  selectedDate?: Date;
  availability?: Availability;
  currency: string;
}

export function TimeslotPicker({
  timeZone,
  availability,
  onSelectDay,
  onSelectTimeslot,
  onMonthChange,
  selectedDate,
  timeslot,
  currency
}: Props) {
  const { dateFnsLocale } = useI18n();
  const [monthDate, setMonthDate] = React.useState(startOfMonth(new Date()));

  const monthInterval = React.useMemo(
    () => ({
      start: zonedTimeToUtc(
        startOfWeek(monthDate, { locale: dateFnsLocale }),
        timeZone
      ),
      end: zonedTimeToUtc(
        endOfWeek(endOfMonth(monthDate), { locale: dateFnsLocale }),
        timeZone
      )
    }),
    [dateFnsLocale, monthDate, timeZone]
  );

  const weeks = React.useMemo(
    () =>
      splitEvery(
        7,
        eachDayOfInterval({
          start: startOfWeek(monthDate, { locale: dateFnsLocale }),
          end: endOfWeek(endOfMonth(monthDate), { locale: dateFnsLocale })
        })
      ),
    [dateFnsLocale, monthDate]
  );

  React.useEffect(() => {
    onMonthChange(monthInterval);
  }, [monthInterval, onMonthChange]);

  const isDayInWeek = (day: Date, week: Date[]) =>
    !!week.find(date => isSameDay(date, day));

  const prevMonth = () => setMonthDate(date => subMonths(date, 1));
  const nextMonth = () => setMonthDate(date => addMonths(date, 1));

  const getTimeslotsFor = (day: Date) => {
    const dayAvailability = (availability || []).find(
      ({ date }) => isSameDay(utcToZonedTime(date, timeZone), day) // Day is in timezone already from weeks
    );
    return dayAvailability?.availableTimeslots ?? [];
  };

  return (
    <table className="mb-4 w-full">
      <Header month={monthDate} onPrev={prevMonth} onNext={nextMonth} />
      <tbody>
        {weeks.map((days, i) => (
          <React.Fragment key={i}>
            <tr>
              {days.map((date, j) => (
                <Day
                  key={j}
                  date={date}
                  currentMonth={getMonth(monthDate)}
                  timeslotCount={getTimeslotsFor(date).length}
                  selected={selectedDate && isSameDay(date, selectedDate)}
                  marked={timeslot?.start && isSameDay(date, timeslot?.start)}
                  onSelect={onSelectDay}
                />
              ))}
            </tr>
            {selectedDate && isDayInWeek(selectedDate, days) && (
              <Timeslots
                currency={currency}
                timeslot={timeslot}
                timeZone={timeZone}
                loading={!availability}
                timeslots={getTimeslotsFor(selectedDate)}
                onSelect={onSelectTimeslot}
              />
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
