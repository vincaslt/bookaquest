import { format, addWeeks, isAfter } from 'date-fns';
import { isSameDay } from 'date-fns/esm';
import { Button } from 'antd';
import { green, blue } from '@ant-design/colors';
import AspectRatio from 'react-aspect-ratio';
import * as React from 'react';
import { Booking, BookingStatus } from '@bookaquest/interfaces';
import { listWeekdays, useI18n } from '@bookaquest/utilities';
import sum from 'ramda/es/sum';
import prop from 'ramda/es/prop';
import inc from 'ramda/es/inc';
import pipe from 'ramda/es/pipe';
import filter from 'ramda/es/filter';
import map from 'ramda/es/map';
import dec from 'ramda/es/dec';
import { AreaChart, XAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';

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
  const { t, dateFnsLocale } = useI18n();
  const [weekOffset, setWeekOffset] = React.useState(0);

  const weekdays = listWeekdays(dateFnsLocale, addWeeks(now, weekOffset));

  const chartData = weekdays.map(weekdayDate => {
    return {
      day: format(weekdayDate, 'MM-dd', { locale: dateFnsLocale }),
      completed: completedEarnings(weekdayDate)(bookings),
      projected: projectedEarnings(weekdayDate)(bookings),
      pending: pendingEarnings(weekdayDate)(bookings)
    };
  });

  console.log(chartData);

  const axisNames: { [key: string]: string } = {
    completed: t`Completed`,
    projected: t`Projected`,
    pending: t`Pending`
  };

  return (
    <div className="flex items-center">
      <Button
        className="flex justify-center mr-4"
        shape="circle"
        icon="left"
        disabled={weekOffset === 0}
        onClick={() => setWeekOffset(dec)}
      />
      <AspectRatio ratio="5/3" style={{ width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart margin={{ left: 20, right: 20 }} data={chartData}>
            <Tooltip
              formatter={(value, key, { payload }) =>
                key === 'pending'
                  ? [payload.pending - payload.projected, axisNames[key]]
                  : [value, axisNames[key]]
              }
            />
            <XAxis interval={0} dataKey="day" />

            <Area
              animationDuration={300}
              type="monotone"
              dataKey="projected"
              stackId="2"
              fill={blue[3]}
              stroke="none"
            />
            <Area
              animationDuration={300}
              type="monotone"
              dataKey="completed"
              stackId="1"
              fill={green[3]}
              stroke="none"
            />
            <Area
              animationDuration={300}
              type="monotone"
              dataKey="pending"
              stackId="3"
              stroke={blue[6]}
              strokeDasharray="5,5"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </AspectRatio>

      <Button
        className="flex justify-center ml-4"
        shape="circle"
        icon="right"
        onClick={() => setWeekOffset(inc)}
      />
    </div>
  );
}

export default EarningsChart;
