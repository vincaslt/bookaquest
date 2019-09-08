import { Button, DatePicker, Form } from 'antd'
import moment, { Moment } from 'moment'
import * as React from 'react'
import * as api from '../../../api/application'
import { CreateBooking } from '../../../interfaces/createBooking'
import { EscapeRoom } from '../../../interfaces/escapeRoom'
import { Timeslot } from '../../../interfaces/timeslot'

export type TimeslotInfo = Pick<CreateBooking, 'startDate' | 'endDate'>

interface Props {
  room: EscapeRoom
  onSelect: (timeslot: TimeslotInfo) => void
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

      {timeslots.map(({ start, end }, i) => (
        <Button
          key={i}
          onClick={() =>
            onSelect({
              startDate: start,
              endDate: end
            })
          }
        >
          {moment(start).format('LT')} - {moment(end).format('LT')}
        </Button>
      ))}
    </div>
  )
}

export default TimeslotStep
