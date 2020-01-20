import { isSameDay } from 'date-fns';
import dropRepeatsWith from 'ramda/es/dropRepeatsWith';
import * as React from 'react';
import { EscapeRoom, Timeslot, Availability } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { debounce } from 'throttle-debounce';
import * as api from '../../../api/application';
import { TimeslotPicker } from '../../../components/TimeslotPicker/TimeslotPicker';

interface Props {
  room: EscapeRoom;
  onSelect: (timeslot: Timeslot) => void;
}

export function TimeslotStep({ room, onSelect }: Props) {
  const { t } = useI18n();
  const [availability, setAvailability] = React.useState<Availability>([]);
  const [selectedDay, setSelectedDay] = React.useState<Date>();

  const handleMonthChange = React.useCallback(
    debounce(300, (interval: { start: Date; end: Date }) => {
      api
        .getAvailability(room._id, interval.start, interval.end)
        .then(results => {
          setAvailability(prev =>
            dropRepeatsWith((a, b) => isSameDay(a.date, b.date), [
              ...prev,
              ...results
            ])
          );
        });
    }),
    [room]
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
        timeZone={room.timezone}
        onSelectTimeslot={onSelect}
        onSelectDay={toggleSelect}
        onMonthChange={handleMonthChange}
        selectedDate={selectedDay}
        availability={availability}
      />
    </>
  );
}
