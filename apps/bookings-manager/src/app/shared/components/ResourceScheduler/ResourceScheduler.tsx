import {
  differenceInHours,
  format,
  min,
  getDay,
  setHours,
  endOfHour,
  eachDayOfInterval,
  addHours,
  isWithinInterval,
  startOfHour,
  Interval
} from 'date-fns';
import * as React from 'react';
import times from 'ramda/es/times';
import { BusinessHours, Booking } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import styled from 'styled-components';
import { ResourceEvent } from './ResourceEvent';

const ROW_HEIGHT = 60;
const COLUMN_WIDTH = 120;

const TableHeading = styled.th`
  height: 36px;
`;

const DayHeading = styled.th`
  height: 36px;
  border: 1px solid #d9d9d9;
  padding: 0.5em;
  border-top: none;
  &:first-child {
    border-left: none;
  }
  &:last-child {
    border-right: none;
  }
`;

const HourHeading = styled.th`
  min-width: ${COLUMN_WIDTH}px;
  height: 36px;
  border: 1px solid #d9d9d9;
  padding: 0.5em;
  &:first-child {
    border-left: none;
  }
  &:last-child {
    border-right: none;
  }
`;

const HourStartCell = styled.td`
  min-width: ${COLUMN_WIDTH / 2}px;
  height: ${ROW_HEIGHT}px;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-right: none;
  &:first-child {
    border-left: none;
  }
`;

const HourEndCell = styled.td`
  min-width: ${COLUMN_WIDTH / 2}px;
  height: ${ROW_HEIGHT}px;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-left: 1px dashed #d9d9d9;
  &:last-child {
    border-right: none;
  }
`;

const ResourceNameCell = styled.td`
  height: ${ROW_HEIGHT}px;
  border: 1px solid #d9d9d9;
  border-left: none;
  padding: 0.5em;
`;

const SchedulerContainer = styled.div`
  width: 100%;
  position: relative;
  overflow-x: auto;
`;

const ResourceNamesTable = styled.table`
  border-right: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
`;

const DayHeadingText = styled.span`
  position: sticky;
  left: 0.5em;
`;

interface Resource {
  name: string;
  availability: BusinessHours[];
  bookings: Booking[];
}

interface Props {
  range: Interval;
  resources: Resource[];
  baseAvailability?: BusinessHours[];
}

// TODO: resource name height dynamic based on row height
// TODO: take timezone into account
export function ResourceScheduler({
  range,
  resources,
  baseAvailability
}: Props) {
  const { dateFnsLocale } = useI18n();
  const days = eachDayOfInterval(range);

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
    <div className="flex">
      <div className="flex border-t border-r mr-auto max-w-full">
        <ResourceNamesTable>
          <thead>
            <tr>
              <TableHeading />
            </tr>
            <tr>
              <TableHeading />
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, i) => (
              <tr key={i}>
                <ResourceNameCell>{resource.name}</ResourceNameCell>
              </tr>
            ))}
          </tbody>
        </ResourceNamesTable>

        <SchedulerContainer>
          <table>
            <thead>
              <tr>
                {globalWorkHours.map(({ day, hours }, i) => (
                  <DayHeading key={i} colSpan={hours.length * 2}>
                    <DayHeadingText>
                      {format(day, 'MMM d, cccc', {
                        locale: dateFnsLocale
                      })}
                    </DayHeadingText>
                  </DayHeading>
                ))}
              </tr>
              <tr>
                {globalWorkHours.map(({ hours }) =>
                  hours.map((hour, i) => (
                    <HourHeading key={i} colSpan={2}>
                      {format(hour, 'p', { locale: dateFnsLocale })}
                    </HourHeading>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, i) => (
                <tr key={i}>
                  {globalWorkHours.map(({ day, hours }) => {
                    // const dayAvailability = resource.availability.find(
                    //   availability => availability.weekday === getDay(day)
                    // );
                    return hours.map((hour, j) => {
                      const booking = resource.bookings.find(({ startDate }) =>
                        isWithinInterval(startDate, {
                          start: startOfHour(hour),
                          end: endOfHour(hour)
                        })
                      );
                      return (
                        <React.Fragment key={j}>
                          <HourStartCell className="relative">
                            {/* {dayAvailability &&
                            getHours(hour) >= dayAvailability.hours[0] &&
                            getHours(hour) <= dayAvailability.hours[1] &&
                            'x'} */}
                            {booking && (
                              <ResourceEvent
                                rowHeight={ROW_HEIGHT}
                                columnWidth={COLUMN_WIDTH}
                                name={booking.name}
                                time={{
                                  start: booking.startDate,
                                  end: booking.endDate
                                }}
                              />
                            )}
                          </HourStartCell>
                          <HourEndCell />
                        </React.Fragment>
                      );
                    });
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </SchedulerContainer>
      </div>
    </div>
  );
}
