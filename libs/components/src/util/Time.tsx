import { format } from 'date-fns';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';

interface Props {
  date: Date | [Date, Date];
  type?: 'date' | 'time' | { format: string };
}

export function Time({ date, type = 'time' }: Props) {
  const { dateFnsLocale } = useI18n();
  const dateFormat =
    typeof type === 'string'
      ? {
          date: 'PPP',
          time: 'p'
        }[type]
      : type.format;

  if (date instanceof Date) {
    return <>{format(date, dateFormat, { locale: dateFnsLocale })}</>;
  }

  return (
    <>
      {format(date[0], dateFormat, { locale: dateFnsLocale })}
      {' - '}
      {format(date[1], dateFormat, { locale: dateFnsLocale })}
    </>
  );
}
