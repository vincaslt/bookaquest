import { convertToTimeZone, convertToLocalTime } from 'date-fns-timezone';
import { isAfter, isEqual } from 'date-fns';

export function convertBetweenTimezones(date: Date, from: string, to: string) {
  return convertToTimeZone(convertToLocalTime(date, { timeZone: from }), {
    timeZone: to
  });
}

/**
 * Is first date after second date
 */
export function isSameOrAfter(date: Date, dateToCompare: Date) {
  return isAfter(date, dateToCompare) || isEqual(date, dateToCompare);
}
