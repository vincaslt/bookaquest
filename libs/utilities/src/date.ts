import { eachDayOfInterval, Locale, startOfWeek, endOfWeek } from 'date-fns';

export function listWeekdays(locale: Locale, day = new Date()) {
  return eachDayOfInterval({
    start: startOfWeek(day, { locale }),
    end: endOfWeek(day, { locale })
  });
}
