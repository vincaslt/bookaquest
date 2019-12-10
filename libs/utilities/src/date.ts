import {
  isAfter,
  isEqual,
  eachDayOfInterval,
  Locale,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export function convertBetweenTimezones(date: Date, from: string, to: string) {
  return utcToZonedTime(zonedTimeToUtc(date, from), to);
}

/**
 * Is first date after second date
 */
export function isSameOrAfter(date: Date, dateToCompare: Date) {
  return isAfter(date, dateToCompare) || isEqual(date, dateToCompare);
}

export function listWeekdays(locale: Locale, day = new Date()) {
  return eachDayOfInterval({
    start: startOfWeek(day, { locale }),
    end: endOfWeek(day, { locale })
  });
}
