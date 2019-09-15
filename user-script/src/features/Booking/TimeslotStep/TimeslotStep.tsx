import { Button, DatePicker, Form } from 'antd'
import moment, { Moment } from 'moment'
import * as React from 'react'
import { EscapeRoom } from '../../../../../commons/interfaces/escapeRoom'
import { Timeslot } from '../../../../../commons/interfaces/timeslot'
import * as api from '../../../api/application'

interface Props {
  room: EscapeRoom
  onSelect: (timeslot: Timeslot) => void
}

function TimeslotStep({ room, onSelect }: Props) {
  const isDayDisabled = (current?: Moment) =>
    !!current && (current < moment().startOf('day') || !room.weekDays.includes(current.weekday()))

  const [date, setDate] = React.useState(isDayDisabled(moment()) ? undefined : moment())
  const [timeslots, setTimeslots] = React.useState<Timeslot[]>([])

  React.useEffect(() => {
    if (date) {
      setTimeslots([])
      api.getAvailability(room.id, date.toDate()).then(setTimeslots)
    }
  }, [date])

  return (
    <div>
      <Form.Item label="Date">
        <DatePicker
          onChange={value => value && setDate(value)}
          value={date}
          disabledDate={isDayDisabled}
        />
      </Form.Item>

      {timeslots.map((timeslot, i) => (
        <Button key={i} onClick={() => onSelect(timeslot)}>
          {moment(timeslot.start).format('LT')} - {moment(timeslot.end).format('LT')}
        </Button>
      ))}
    </div>
  )
}

export default TimeslotStep
