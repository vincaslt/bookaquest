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
  Interval,
  max
} from 'date-fns';
import * as React from 'react';
import times from 'ramda/es/times';
import { BusinessHours, Booking, BookingStatus } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import styled from 'styled-components';
import { ResourceEvent } from './ResourceEvent';
import { CurrentHourMarker } from './CurrentHourMarker';

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

const HourHeading = styled.th`
  min-width: ${COLUMN_WIDTH}px;
  height: 36px;
  padding: 0.5em;
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: ${({ lastHour }: { lastHour: boolean }) =>
      lastHour ? '2px' : '1px'}
    solid #d9d9d9;
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
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: 1px dashed #d9d9d9;
  &:first-child {
    border-left: none;
  }
`;

const HourEndCell = styled.td`
  min-width: ${COLUMN_WIDTH / 2}px;
  height: ${ROW_HEIGHT}px;
  background-color: #fafafa;
  border-bottom: 1px solid #d9d9d9;
  border-right: ${({ lastHour }: { lastHour: boolean }) =>
      lastHour ? '2px' : '1px'}
    solid #d9d9d9;
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
  onClickEvent: (booking: Booking) => void;
}

// TODO: resource name height dynamic based on row height
// TODO: take timezone into account
export function ResourceScheduler({
  range,
  resources,
  baseAvailability,
  onClickEvent
}: Props) {
  const { dateFnsLocale, t } = useI18n();
  const [now, setNow] = React.useState(new Date());
  const days = eachDayOfInterval(range);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

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
    const toHour = max(
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
                    <HourHeading
                      key={i}
                      colSpan={2}
                      lastHour={i === hours.length - 1}
                    >
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
                                tooltip={t`${bookingStatus(booking)}, ${
                                  booking.name
                                }`}
                                className={bookingColor(booking)}
                                rowHeight={ROW_HEIGHT}
                                columnWidth={COLUMN_WIDTH}
                                name={booking.name}
                                time={[booking.startDate, booking.endDate]}
                                onClick={() => onClickEvent(booking)}
                              />
                            )}
                            {isWithinInterval(now, {
                              start: startOfHour(hour),
                              end: endOfHour(hour)
                            }) && (
                              <CurrentHourMarker
                                rowHeight={ROW_HEIGHT}
                                columnWidth={COLUMN_WIDTH}
                              />
                            )}
                          </HourStartCell>
                          <HourEndCell lastHour={j === hours.length - 1} />
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
