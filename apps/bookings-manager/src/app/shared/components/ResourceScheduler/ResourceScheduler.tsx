import * as React from 'react';
import { eachDayOfInterval, addDays, addHours } from 'date-fns/esm';
import {
  startOfDay,
  endOfDay,
  differenceInHours,
  format,
  min,
  getDay,
  setHours,
  getHours
} from 'date-fns';
import times from 'ramda/es/times';
import { BusinessHours } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import styled from 'styled-components';

const HourHeading = styled.th`
  min-width: 50px;
`;

const DayText = styled.th`
  position: sticky;
  left: 0;
`;

const SchedulerContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

interface Resource {
  name: string;
  availability: BusinessHours[];
}

interface Props {
  resources: Resource[];
  baseAvailability?: BusinessHours[];
}

// TODO: take timezone into account
export function ResourceScheduler({ resources, baseAvailability }: Props) {
  const { dateFnsLocale } = useI18n();
  const today = new Date();
  const days = eachDayOfInterval({
    start: startOfDay(today),
    end: endOfDay(addDays(today, 7))
  });

  const weeklyAvailability = days.map(day => {
    const weekday = getDay(day);
    const baseAvailabilityForDay = baseAvailability?.find(
      availability => availability.weekday === weekday
    );
    const hoursForDay = resources.reduce(
      (acc, resource) => {
        const availabilityForDay = resource.availability.find(
          availability => availability.weekday === weekday
        );
        return availabilityForDay ? [...acc, availabilityForDay.hours] : acc;
      },
      baseAvailabilityForDay ? [baseAvailabilityForDay.hours] : []
    );

    if (hoursForDay.length === 0) {
      return {
        day,
        hours: []
      };
    }

    const fromHour = min(
      hoursForDay.map(([start]) => setHours(day, Math.floor(start)))
    );
    const toHour = min(
      hoursForDay.map(([, end]) => setHours(day, Math.ceil(end)))
    );

    const hours = times(
      i => addHours(fromHour, i),
      differenceInHours(toHour, fromHour) + 1
    );

    return {
      day,
      hours
    };
  });

  const globalWorkHours = weeklyAvailability.filter(
    availability => availability.hours.length
  );

  return (
    <SchedulerContainer>
      <table className="table-fixed">
        <thead>
          <tr>
            <th></th>
            {globalWorkHours.map(({ day, hours }) => (
              <th colSpan={hours.length}>
                <DayText>
                  {format(day, 'MMM d, cccc', {
                    locale: dateFnsLocale
                  })}
                </DayText>
              </th>
            ))}
          </tr>
          <tr>
            <th></th>
            {globalWorkHours.map(({ hours }) =>
              hours.map(hour => (
                <HourHeading>
                  {format(hour, 'p', { locale: dateFnsLocale })}
                </HourHeading>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr>
              <td>{resource.name}</td>
              {globalWorkHours.map(({ day, hours }) => {
                const dayAvailability = resource.availability.find(
                  availability => availability.weekday === getDay(day)
                );
                return hours.map(hour => (
                  <td className="bordered">
                    {dayAvailability &&
                      getHours(hour) >= dayAvailability.hours[0] &&
                      getHours(hour) <= dayAvailability.hours[1] &&
                      'x'}
                  </td>
                ));
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </SchedulerContainer>
  );
}
