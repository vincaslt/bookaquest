import { utcToZonedTime, format } from 'date-fns-tz';
import { isSameDay } from 'date-fns';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';

interface Props {
  date: Date | [Date, Date];
  type?: 'date' | 'time' | { format: string };
  timeZone?: string;
}

export function Time({ date, type = 'time', timeZone }: Props) {
  const { dateFnsLocale } = useI18n();
  const dateFormat =
    typeof type === 'string'
      ? {
          date: 'PPP',
          time: 'p'
        }[type]
      : type.format;

  const formatWithTimezone = (utcDate: Date, _dateFormat = dateFormat) =>
    format(
      timeZone ? utcToZonedTime(utcDate, timeZone) : utcDate,
      _dateFormat,
      {
        locale: dateFnsLocale,
        timeZone
      }
    );

  if (date instanceof Date) {
    return <>{formatWithTimezone(date)}</>;
  }

  return (
    <>
      {formatWithTimezone(date[0])}
      {' - '}
      {formatWithTimezone(
        date[1],
        isSameDay(date[0], date[1]) ? 'p' : undefined
      )}
    </>
  );
}
