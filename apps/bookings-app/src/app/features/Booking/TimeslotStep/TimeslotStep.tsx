import { addDays, isSameDay } from 'date-fns';
import dropRepeatsWith from 'ramda/es/dropRepeatsWith';
import * as React from 'react';
import { EscapeRoom, Timeslot, Availability } from '@bookaquest/interfaces';
import * as api from '../../../api/application';
import { TimeslotPicker } from '../../../components/TimeslotPicker/TimeslotPicker';

interface Props {
  room: EscapeRoom;
  onSelect: (timeslot: Timeslot) => void;
}

export function TimeslotStep({ room, onSelect }: Props) {
  const [availability, setAvailability] = React.useState<Availability>([]);
  const [selectedDay, setSelectedDay] = React.useState<Date>();

  // TODO: cancel prev request or aggregate them
  const handleMonthChange = React.useCallback(
    (monthDate: Date) => {
      api
        .getAvailability(room._id, monthDate, addDays(monthDate, 34))
        .then(results =>
          setAvailability(prev =>
            dropRepeatsWith((a, b) => isSameDay(a.date, b.date), [
              ...prev,
              ...results
            ])
          )
        );
    },
    [room]
  );

  const toggleSelect = (day: Date) =>
    setSelectedDay(selected =>
      !selected || !isSameDay(selected, day) ? day : undefined
    );

  return (
    <TimeslotPicker
      businessHours={room.businessHours}
      onSelectTimeslot={onSelect}
      onSelectDay={toggleSelect}
      onMonthChange={handleMonthChange}
      selectedDate={selectedDay}
      availability={availability}
    />
  );
}
