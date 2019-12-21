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
  selectedDate?: Date;
  availability?: Availability;
}

// ! TODO: convert month interval to timezone
export function TimeslotPicker({
  timeZone,
  availability,
  onSelectDay,
  onSelectTimeslot,
  onMonthChange,
  selectedDate
}: Props) {
  const { dateFnsLocale } = useI18n();
  const [monthDate, setMonthDate] = React.useState(startOfMonth(new Date()));

  const getMonthInterval = React.useCallback(
    () => ({
      start: startOfWeek(monthDate, { locale: dateFnsLocale }),
      end: endOfWeek(endOfMonth(monthDate), { locale: dateFnsLocale })
    }),
    [dateFnsLocale, monthDate]
  );

  React.useEffect(() => {
    onMonthChange(getMonthInterval());
  }, [getMonthInterval, onMonthChange]);

  const weeks = splitEvery(7, eachDayOfInterval(getMonthInterval()));

  const isDayInWeek = (day: Date, week: Date[]) =>
    !!week.find(date => isSameDay(date, day));

  const prevMonth = () => setMonthDate(date => subMonths(date, 1));
  const nextMonth = () => setMonthDate(date => addMonths(date, 1));

  const getTimeslotsFor = (day: Date) => {
    const dayAvailability = (availability || []).find(({ date }) =>
      isSameDay(date, day)
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
                  onSelect={onSelectDay}
                />
              ))}
            </tr>
            {selectedDate && isDayInWeek(selectedDate, days) && (
              <Timeslots
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
