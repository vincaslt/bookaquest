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
  Interval,
  max,
  endOfDay,
  startOfDay,
  isSameDay,
  addMinutes
} from 'date-fns';
import Paragraph from 'antd/lib/typography/Paragraph';
import { utcToZonedTime } from 'date-fns-tz';
import { isBefore } from 'date-fns/esm';
import * as React from 'react';
import times from 'ramda/es/times';
import { BusinessHours, Booking, BookingStatus } from '@bookaquest/interfaces';
import { isSameOrAfter, useI18n } from '@bookaquest/utilities';
import styled from 'styled-components';
import { ResourceEvent } from './ResourceEvent';
import { CurrentHourMarker } from './CurrentHourMarker';
import {
  getAvailabilitiesInTimezone,
  dateToHours,
  getRangeIntersection,
  containRanges
} from './utils';

const ROW_HEIGHT = 60;
const COLUMN_WIDTH = 120;

const TableHeading = styled.th`
  height: 36px;
`;

const DayHeading = styled.th`
  height: 36px;
  padding: 0.5em;
  border-top: none;
  border-bottom: 1px solid #d9d9d9;
  border-right: 2px solid #d9d9d9;
  &:first-child {
    border-left: none;
  }
  &:last-child {
    border-right: none;
  }
`;

const HourHeading = styled.th<{ lastHour: boolean; outdated?: boolean }>`
  min-width: ${COLUMN_WIDTH}px;
  height: 36px;
  padding: 0.5em;
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: ${({ lastHour }) => (lastHour ? '2px' : '1px')} solid #d9d9d9;
  ${({ outdated }) => (outdated ? 'opacity: 0.5;' : '')}
  &:first-child {
    border-left: none;
  }
  &:last-child {
    border-right: none;
  }
`;

const HourStartCell = styled.td<{ isWorkHour: boolean }>`
  min-width: ${COLUMN_WIDTH / 2}px;
  height: ${ROW_HEIGHT}px;
  background-color: ${({ isWorkHour }) => (isWorkHour ? 'white' : '#f5f5f5')};
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: 1px dashed #d9d9d9;
  &:first-child {
    border-left: none;
  }
`;

const HourEndCell = styled.td<{ lastHour: boolean; isWorkHour: boolean }>`
  min-width: ${COLUMN_WIDTH / 2}px;
  height: ${ROW_HEIGHT}px;
  background-color: ${({ isWorkHour }) => (isWorkHour ? 'white' : '#f5f5f5')};
  border-bottom: 1px solid #d9d9d9;
  border-right: ${({ lastHour }) => (lastHour ? '2px' : '1px')} solid #d9d9d9;
  &:last-child {
    border-right: none;
  }
`;

const ResourceNameCell = styled.td`
  height: ${ROW_HEIGHT}px;
  max-width: ${COLUMN_WIDTH * 2}px;
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
  white-space: nowrap;
`;

interface Resource {
  id: string;
  name: string;
  timeZone: string;
  availability: BusinessHours[];
  bookings: Booking[];
}

interface Props {
  range: Interval;
  resources: Resource[];
  timeZone: string;
  baseAvailability?: BusinessHours[];
  onClickEvent: (booking: Booking[]) => void;
}

// TODO: overlapping bookings support (show combined min max with lighter shade color for difference)
// TODO: resource name height dynamic based on row height
// TODO: don't let column width expand (e.g. when day is overflowing)
// ! TODO: focus current time or earliest booking on opening
export function ResourceScheduler({
  range,
  resources,
  timeZone,
  baseAvailability,
  onClickEvent
}: Props) {
  const { dateFnsLocale, t } = useI18n();
  const [now, setNow] = React.useState(utcToZonedTime(new Date(), timeZone));

  const days = eachDayOfInterval(range);

  const resourcesAvailabilities = getAvailabilitiesInTimezone(
    range.start as Date,
    resources,
    timeZone
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(utcToZonedTime(new Date(), timeZone));
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [timeZone]);

  const bookingStatus = (booking: Booking) =>
    ({
      [BookingStatus.Accepted]: t`Accepted`,
      [BookingStatus.Rejected]: t`Rejected`,
      [BookingStatus.Pending]: t`Pending`,
      [BookingStatus.Canceled]: t`Canceled`
    }[booking.status]);

  const bookingColor = (booking: Booking) =>
    ({
      [BookingStatus.Accepted]: 'bg-green-100',
      [BookingStatus.Rejected]: 'bg-red-100',
      [BookingStatus.Pending]: 'bg-geekblue-100',
      [BookingStatus.Canceled]: 'bg-orange-100'
    }[booking.status]);

  const weeklyAvailability = days.map(day => {
    const weekday = getDay(day);

    // If base availability exists, it's already in the correct timezone
    const baseAvailabilityForDay = baseAvailability?.find(
      availability => availability.weekday === weekday
    );

    const hoursForDay = resources.reduce(
      (acc, resource) => {
        const availabilityForDay = resourcesAvailabilities[resource.id].filter(
          ([start, end]) => weekday === getDay(start) || weekday === getDay(end)
        );

        if (availabilityForDay.length) {
          return [
            ...acc,
            containRanges(
              availabilityForDay.map(
                availability =>
                  getRangeIntersection(
                    [startOfDay(day), endOfDay(day)],
                    availability
                  ).map(dateToHours) as [number, number]
              )
            )
          ];
        }

        return acc;
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
    const toHour = max(
      hoursForDay.map(([, end]) => setHours(day, Math.ceil(end)))
    );

    const hours = times(
      i => addHours(fromHour, i),
      differenceInHours(toHour, fromHour)
    );

    return {
      day,
      hours
    };
  });

  const globalWorkHours = weeklyAvailability.filter(
    availability => availability.hours.length
  );

  console.log(globalWorkHours);

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
                <ResourceNameCell>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    strong
                    className="max-w-full"
                    style={{ marginBottom: 0 }}
                  >
                    {resource.name}
                  </Paragraph>
                </ResourceNameCell>
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
                    <HourHeading
                      key={i}
                      colSpan={2}
                      lastHour={i === hours.length - 1}
                      outdated={isBefore(addHours(hour, 1), now)}
                    >
                      {format(hour, 'p', { locale: dateFnsLocale })}
                    </HourHeading>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, i) => {
                return (
                  <tr key={i}>
                    {globalWorkHours.map(({ day, hours }) => {
                      const availabilityForDay = resourcesAvailabilities[
                        resource.id
                      ].filter(
                        ([start, end]) =>
                          isSameDay(day, start) || isSameDay(day, end)
                      );

                      return hours.map((hour, j) => {
                        const bookingsAtHourStart = resource.bookings.filter(
                          ({ startDate }) => {
                            const date = utcToZonedTime(startDate, timeZone);
                            return (
                              isSameOrAfter(date, hour) &&
                              isBefore(date, addMinutes(hour, 30))
                            );
                          }
                        );
                        const bookingsAtHourEnd = resource.bookings.filter(
                          ({ startDate }) => {
                            const date = utcToZonedTime(startDate, timeZone);
                            return (
                              isSameOrAfter(date, addMinutes(hour, 30)) &&
                              isBefore(date, endOfHour(hour))
                            );
                          }
                        );
                        const bookingsAtHour = [
                          bookingsAtHourStart,
                          bookingsAtHourEnd
                        ];

                        const isStartWorkHour = availabilityForDay.some(
                          ([start, end]) =>
                            isSameOrAfter(hour, start) && isBefore(hour, end)
                        );

                        const isEndWorkHour = availabilityForDay.some(
                          ([start, end]) =>
                            isSameOrAfter(addMinutes(hour, 30), start) &&
                            isBefore(addMinutes(hour, 30), end)
                        );

                        return (
                          <React.Fragment key={j}>
                            <HourStartCell
                              className="relative"
                              isWorkHour={isStartWorkHour}
                            >
                              {bookingsAtHour.map(periodBookings => {
                                const booking = periodBookings[0];
                                return (
                                  booking && (
                                    <ResourceEvent
                                      key={booking._id}
                                      timeZone={timeZone}
                                      overlappingCount={
                                        periodBookings.length > 1
                                          ? periodBookings.length
                                          : 0
                                      }
                                      tooltip={`${bookingStatus(booking)}, ${
                                        booking.name
                                      }`}
                                      className={bookingColor(booking)}
                                      rowHeight={ROW_HEIGHT}
                                      columnWidth={COLUMN_WIDTH}
                                      name={booking.name}
                                      time={[
                                        booking.startDate,
                                        booking.endDate
                                      ]}
                                      onClick={() =>
                                        onClickEvent(periodBookings)
                                      }
                                    />
                                  )
                                );
                              })}
                              {isWithinInterval(now, {
                                start: hour,
                                end: endOfHour(hour)
                              }) && (
                                <CurrentHourMarker
                                  currentHour={now}
                                  rowHeight={ROW_HEIGHT}
                                  columnWidth={COLUMN_WIDTH}
                                />
                              )}
                            </HourStartCell>
                            <HourEndCell
                              isWorkHour={isEndWorkHour}
                              lastHour={j === hours.length - 1}
                            />
                          </React.Fragment>
                        );
                      });
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SchedulerContainer>
      </div>
    </div>
  );
}
