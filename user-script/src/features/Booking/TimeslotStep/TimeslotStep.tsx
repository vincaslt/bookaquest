import { Button, DatePicker, Form } from 'antd'
import moment from 'moment'
import times from 'ramda/es/times'
import * as React from 'react'
import { CreateBooking } from '../../../interfaces/createBooking'
import { EscapeRoom } from '../../../interfaces/escapeRoom'

export type TimeslotInfo = Pick<CreateBooking, 'startDate' | 'endDate'>

interface Props {
  room: EscapeRoom
  onSelect: (timeslot: TimeslotInfo) => void
}

function TimeslotStep({ room, onSelect }: Props) {
  const [date, setDate] = React.useState(moment())
  const [startHour, endHour] = room.workHours

  // TODO: check timeslot availabilities
  const timeslots = times(i => {
    const start = moment(date)
      .startOf('day')
      .minutes(startHour * 60 + i * room.interval)
    const end = moment(date)
      .startOf('day')
      .minutes(startHour * 60 + (i + 1) * room.interval)
    return { start, end, key: i }
  }, ((endHour - startHour) * 60) / room.interval)

  return (
    <div>
      <Form.Item label="Date">
        <DatePicker
          onChange={value => value && setDate(value)}
          value={date}
          disabledDate={current =>
            !!current &&
            (current < moment().startOf('day') || !room.weekDays.includes(current.weekday()))
          }
        />
      </Form.Item>

      {timeslots.map(({ start, end, key }) => (
        <Button
          key={key}
          onClick={() =>
            onSelect({
              startDate: start.toDate(),
              endDate: end.toDate()
            })
          }
        >
          {start.format('LT')} - {end.format('LT')}
        </Button>
      ))}
    </div>
  )
}

export default TimeslotStep
