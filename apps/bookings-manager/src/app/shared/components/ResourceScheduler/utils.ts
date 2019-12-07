import {
  setHours,
  startOfDay,
  getHours,
  getMinutes,
  max,
  min,
  addDays,
  getDay,
  setMinutes
} from 'date-fns';
import { BusinessHours } from '@bookaquest/interfaces';
import { convertBetweenTimezones } from '../../../utils/date';

function setDayUpcoming(date: Date, weekday: number) {
  return weekday > getDay(date)
    ? addDays(date, weekday - getDay(date))
    : addDays(date, 7 - getDay(date) + weekday);
}

export function getAvailabilitiesInTimezone(
  startDate: Date,
  resources: { id: string; availability: BusinessHours[]; timeZone: string }[],
  timeZone: string
) {
  return resources.reduce(
    (availabilities, resource) => {
      return {
        ...availabilities,
        [resource.id]: resource.availability.map<[Date, Date]>(
          ({ hours: [start, end], weekday }) => {
            const date = setDayUpcoming(startOfDay(startDate), weekday);

            return [
              convertBetweenTimezones(
                hoursToDate(date, start),
                resource.timeZone,
                timeZone
              ),
              convertBetweenTimezones(
                hoursToDate(date, end),
                resource.timeZone,
                timeZone
              )
            ];
          }
        )
      };
    },
    {} as {
      [id: string]: [Date, Date][];
    }
  );
}

export function hoursToDate(date: Date, numberHours: number) {
  return setMinutes(
    setHours(date, Math.floor(numberHours)),
    (numberHours % 1) * 60
  );
}

export function dateToHours(date: Date) {
  return getHours(date) + getMinutes(date) / 60;
}

export function containRanges(ranges: [number, number][]): [number, number] {
  return [
    Math.min(...ranges.map(([start]) => start)),
    Math.max(...ranges.map(([, end]) => end))
  ];
}

export function getRangeIntersection(
  range1: [Date, Date],
  range2: [Date, Date]
): [Date, Date] {
  return [max([range1[0], range2[0]]), min([range1[1], range2[1]])];
}
