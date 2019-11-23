import { format, addWeeks, isAfter } from 'date-fns';
import { isSameDay } from 'date-fns/esm';
import { Button } from 'antd';
import { green } from '@ant-design/colors';
import * as React from 'react';
import {
  VictoryChart,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { listWeekdays, useI18n } from '@bookaquest/utilities';
import sum from 'ramda/es/sum';
import prop from 'ramda/es/prop';
import inc from 'ramda/es/inc';
import pipe from 'ramda/es/pipe';
import filter from 'ramda/es/filter';
import map from 'ramda/es/map';
import dec from 'ramda/es/dec';

type BookingFilter = (weekdayDate: Date) => (booking: Booking) => boolean;
type EarningsCalculator = (weekdayDate: Date) => (x: Booking[]) => number;
type GetEarningsCalculator = (
  bookingsFilter: BookingFilter
) => EarningsCalculator;

const acceptedBooking: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) &&
  booking.status === BookingStatus.Accepted;

const pendingBooking: BookingFilter = weekdayDate => booking =>
  isSameDay(booking.endDate, weekdayDate) &&
  booking.status === BookingStatus.Pending;

const completedBooking: BookingFilter = weekdayDate => booking =>
  isAfter(new Date(), booking.endDate) && acceptedBooking(weekdayDate)(booking);

const pendingOrAcceptedBooking: BookingFilter = weekdayDate => booking =>
  acceptedBooking(weekdayDate)(booking) || pendingBooking(weekdayDate)(booking);

const getEarningsCalculator: GetEarningsCalculator = bookingFilter => weekdayDate =>
  pipe(
    filter<Booking, 'array'>(bookingFilter(weekdayDate)),
    map(prop('price')),
    sum
  );

const pendingEarnings = getEarningsCalculator(pendingOrAcceptedBooking);
const projectedEarnings = getEarningsCalculator(acceptedBooking);
const completedEarnings = getEarningsCalculator(completedBooking);

interface Props {
  bookings: Booking[];
}

// TODO: switch mode - text/graph
// TODO: query last weeks bookings when going back
function EarningsChart({ bookings }: Props) {
  const now = new Date();
  const { dateFnsLocale } = useI18n();
  const [weekOffset, setWeekOffset] = React.useState(0);

  const weekdays = listWeekdays(dateFnsLocale, addWeeks(now, weekOffset));

  const toChartDataFor = (calc: EarningsCalculator) =>
    weekdays.map(weekdayDate => {
      const earnings = calc(weekdayDate)(bookings);
      return {
        x: format(weekdayDate, 'ccc', { locale: dateFnsLocale }),
        y: earnings,
        label: `${format(weekdayDate, 'cccc', {
          locale: dateFnsLocale
        })}: ${earnings}`
      };
    });

  const pending = toChartDataFor(pendingEarnings);
  const projected = toChartDataFor(projectedEarnings);
  const completed = toChartDataFor(completedEarnings);

  const totalProjected = sum(projected.map(prop('y')));

  return (
    <div className="flex items-center">
      <Button
        className="flex justify-center"
        shape="circle"
        icon="left"
        disabled={weekOffset === 0}
        onClick={() => setWeekOffset(dec)}
      />
      <VictoryChart containerComponent={<VictoryVoronoiContainer />}>
        <VictoryArea
          labelComponent={<></>}
          domain={totalProjected ? undefined : { y: [0, 10] }}
          style={{
            data: { fill: green[1] }
          }}
          data={projected}
        />
        <VictoryArea
          labelComponent={<></>}
          domain={totalProjected ? undefined : { y: [0, 10] }}
          style={{ data: { fill: green[5] } }}
          data={completed}
        />
        <VictoryArea
          labelComponent={<VictoryTooltip />}
          domain={totalProjected ? undefined : { y: [0, 10] }}
          style={{
            data: { fill: 'none', stroke: green[3], strokeDasharray: '5,5' }
          }}
          data={pending}
        />
      </VictoryChart>
      <Button
        className="flex justify-center"
        shape="circle"
        icon="right"
        onClick={() => setWeekOffset(inc)}
      />
    </div>
  );
}

export default EarningsChart;
