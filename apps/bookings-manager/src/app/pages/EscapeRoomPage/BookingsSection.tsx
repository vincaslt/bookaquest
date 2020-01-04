import { Button, Spin } from 'antd';
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import * as React from 'react';
import { Booking, EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { dec, inc } from 'ramda';
import { Time } from '@bookaquest/components';
import * as api from '../../api/application';
import { Section } from '../../shared/layout/Section';
import { BookingsList } from '../../shared/components/BookingsList';

interface Props {
  escapeRoom?: EscapeRoom;
}

// TODO: loading state for long load times when using pagination? Promise race with delay in useLoading?
export function EscapeRoomBookingsList({ escapeRoom }: Props) {
  const { t, dateFnsLocale } = useI18n();
  const [bookings, setBookings] = React.useState<Booking[]>();
  const [weekOffset, setWeekOffset] = React.useState(0);

  React.useEffect(() => {
    if (!escapeRoom) {
      return;
    }

    const now = zonedTimeToUtc(new Date(), escapeRoom.timezone);
    const week = addWeeks(now, weekOffset);

    let isCancelled = false;

    api
      .getEscapeRoomBookings(escapeRoom._id, {
        from: zonedTimeToUtc(
          startOfWeek(week, { locale: dateFnsLocale }),
          escapeRoom.timezone
        ),
        to: zonedTimeToUtc(
          endOfWeek(week, { locale: dateFnsLocale }),
          escapeRoom.timezone
        )
      })
      .then(result => {
        if (!isCancelled) {
          setBookings(result.bookings);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [escapeRoom, weekOffset, dateFnsLocale]);

  const renderRangeText = () => {
    if (!escapeRoom) {
      return null;
    }

    const now = utcToZonedTime(new Date(), escapeRoom.timezone);
    const week = addWeeks(now, weekOffset);

    return (
      <Time
        type="date"
        date={[
          zonedTimeToUtc(
            startOfWeek(week, { locale: dateFnsLocale }),
            escapeRoom.timezone
          ),
          zonedTimeToUtc(
            endOfWeek(week, { locale: dateFnsLocale }),
            escapeRoom.timezone
          )
        ]}
        timeZone={escapeRoom.timezone}
      />
    );
  };

  return (
    <Section title={t`Booking history`} extra={renderRangeText()}>
      {!escapeRoom || !bookings ? (
        <div className="m-4 text-center">
          <Spin />
        </div>
      ) : (
        <div className="flex items-center">
          <Button
            className="flex justify-center mr-4"
            shape="circle"
            icon="left"
            onClick={() => setWeekOffset(dec)}
          />
          <div className="flex flex-grow px-4">
            <BookingsList timeZone={escapeRoom.timezone} bookings={bookings} />
          </div>
          <Button
            className="flex justify-center ml-4"
            shape="circle"
            icon="right"
            onClick={() => setWeekOffset(inc)}
          />
        </div>
      )}
    </Section>
  );
}
