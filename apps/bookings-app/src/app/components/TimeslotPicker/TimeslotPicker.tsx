import {
  addDays,
  addMonths,
  getMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns';
import splitEvery from 'ramda/es/splitEvery';
import times from 'ramda/es/times';
import { useI18n } from '@bookaquest/utilities';
import * as React from 'react';
import { BusinessHours, Timeslot, Availability } from '@bookaquest/interfaces';
import { Day } from './Day';
import { Header } from './Header';
import { Timeslots } from './Timeslots';

interface Props {
  businessHours: BusinessHours[];
  onSelectTimeslot: (date: Timeslot) => void;
  onSelectDay: (date: Date) => void;
  onMonthChange: (monthDate: Date) => void;
  selectedDate?: Date;
  availability?: Availability;
}

export function TimeslotPicker({
  availability,
  onSelectDay,
  onSelectTimeslot,
  onMonthChange,
  selectedDate
}: Props) {
  const now = new Date();
  const { dateFnsLocale } = useI18n();
  const [monthDate, setMonthDate] = React.useState(startOfMonth(now));

  const startDay = startOfWeek(monthDate, { locale: dateFnsLocale });

  const weeks = splitEvery(
    7,
    times(i => addDays(startDay, i), 7 * 5)
  );
  const isDayInWeek = (day: Date, week: Date[]) =>
    !!week.find(date => isSameDay(date, day));

  const prevMonth = () => setMonthDate(date => subMonths(date, 1));
  const nextMonth = () => setMonthDate(date => addMonths(date, 1));

  const getTimeslotsFor = (day: Date) => {
    const dayAvailability = (availability || []).find(({ date }) =>
      isSameDay(date, day)
    );
    return dayAvailability ? dayAvailability.availableTimeslots : [];
  };

  React.useEffect(() => {
    onMonthChange(monthDate);
  }, [monthDate, onMonthChange]);

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
