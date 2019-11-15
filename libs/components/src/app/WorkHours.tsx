import { set } from 'date-fns';
import prop from 'ramda/es/prop';
import sortBy from 'ramda/es/sortBy';
import * as React from 'react';
import { BusinessHours } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { Time } from '../util/Time';

interface Props {
  businessHours?: BusinessHours[];
}

const sortByWeekday = sortBy(prop('weekday'));
const toTime = (hours: number) =>
  set(new Date(), { hours: Math.floor(hours), minutes: (hours % 1) * 60 });

export function WorkHours({ businessHours = [] }: Props) {
  const { t } = useI18n();

  const weekdays = [
    t`Monday`,
    t`Tuesday`,
    t`Wednesday`,
    t`Thursday`,
    t`Friday`,
    t`Saturday`,
    t`Sunday`
  ];
  return (
    <div>
      {businessHours.length ? (
        sortByWeekday(businessHours).map(({ hours, weekday }) => (
          <div className="mb-1" key={weekday}>
            <span className="font-medium mr-2">{weekdays[weekday - 1]}</span>
            <span>
              <Time date={[toTime(hours[0]), toTime(hours[1])]} />
            </span>
          </div>
        ))
      ) : (
        <>{t`No business hours set`}</>
      )}
    </div>
  );
}
