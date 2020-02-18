import { isSameDay } from 'date-fns';
import { debounce } from 'throttle-debounce';
import * as React from 'react';
import { Availability, EscapeRoom, Timeslot } from '@bookaquest/interfaces';
import { dropRepeatsWith } from 'ramda';
import { useI18n } from '@bookaquest/utilities';
import { TimeslotPicker } from '../../../components/TimeslotPicker/TimeslotPicker';
import * as api from '../../../api/application';

interface Props {
  timeslot?: Timeslot;
  participants: number;
  room: EscapeRoom;
  onSelectTimeslot: (date: Timeslot) => void;
  initialTimeslot?: Timeslot;
}

function TimeslotInput({
  participants,
  room,
  initialTimeslot,
  onSelectTimeslot,
  timeslot
}: Props) {
  const { t } = useI18n();
  const [availability, setAvailability] = React.useState<Availability>([]);
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    initialTimeslot?.start
  );

  const handleMonthChange = React.useCallback(
    debounce(300, (interval: { start: Date; end: Date }) => {
      if (
        participants < room.participants[0] ||
        participants > room.participants[1]
      ) {
        return;
      }

      api
        .getAvailability(room._id, interval.start, interval.end, participants)
        .then(results => {
          setAvailability(prev =>
            dropRepeatsWith((a, b) => isSameDay(a.date, b.date), [
              ...results,
              ...prev
            ])
          );
        });
    }),
    [room._id, participants]
  );

  const toggleSelect = (day: Date) =>
    setSelectedDay(selected =>
      !selected || !isSameDay(selected, day) ? day : undefined
    );

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      {room.timezone !== localTimeZone && (
        <div className="mb-2">{t`Timezone: ${room.timezone}`}</div>
      )}
      <TimeslotPicker
        currency={room.currency}
        timeslot={timeslot}
        timeZone={room.timezone}
        onSelectTimeslot={onSelectTimeslot}
        onSelectDay={toggleSelect}
        onMonthChange={handleMonthChange}
        selectedDate={selectedDay}
        availability={availability}
      />
    </>
  );
}

export default TimeslotInput;
