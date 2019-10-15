import { addDays, isSameDay } from 'date-fns'
import dropRepeatsWith from 'ramda/es/dropRepeatsWith'
import * as React from 'react'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Availability, Timeslot } from '~/../commons/interfaces/timeslot'
import * as api from '../../../api/application'
import TimeslotPicker from '../../../components/TimeslotPicker/TimeslotPicker'

interface Props {
  room: EscapeRoom
  onSelect: (timeslot: Timeslot) => void
}

function TimeslotStep({ room, onSelect }: Props) {
  const [availability, setAvailability] = React.useState<Availability>([])
  const [selectedDay, setSelectedDay] = React.useState<Date>()

  // TODO: cancel prev request or aggregate them
  const handleMonthChange = (monthDate: Date) => {
    api
      .getAvailability(room.id, monthDate, addDays(monthDate, 34))
      .then(results =>
        setAvailability(prev =>
          dropRepeatsWith((a, b) => isSameDay(a.date, b.date), [...prev, ...results])
        )
      )
  }

  const toggleSelect = (day: Date) =>
    setSelectedDay(selected => (!selected || !isSameDay(selected, day) ? day : undefined))

  return (
    <TimeslotPicker
      businessHours={room.businessHours}
      onSelectTimeslot={onSelect}
      onSelectDay={toggleSelect}
      onMonthChange={handleMonthChange}
      selectedDate={selectedDay}
      availability={availability}
    />
  )
}

export default TimeslotStep
