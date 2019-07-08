import { Button } from 'antd'
import * as React from 'react'
import { FieldProps } from 'react-jsonschema-form'

// TODO: timezone
interface TimeSlot {
  startTime: Date
  endTime: Date
  info: {
    title: string
  }
}

const timeslots: TimeSlot[] = [
  {
    startTime: new Date('2019-07-06 12:00'),
    endTime: new Date('2019-07-06 12:30'),
    info: { title: 'Pirmas' }
  },
  {
    startTime: new Date('2019-07-06 12:30'),
    endTime: new Date('2019-07-06 13:00'),
    info: { title: 'Antras' }
  }
]

function TimeSlotPicker(props: FieldProps) {
  const [selected, setSelected] = React.useState<TimeSlot | undefined | null>(undefined)

  const handleSelectTimeslot = (timeslot: TimeSlot) => () => setSelected(timeslot)

  React.useEffect(() => {
    if (selected !== undefined) {
      props.onChange(selected)
    }
  }, [selected])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <legend>{props.schema.title}</legend>
      {timeslots.map((timeslot, i) => (
        <Button key={i} onClick={handleSelectTimeslot(timeslot)}>
          {selected === timeslot && '=> '}
          {timeslot.info.title} ({timeslot.startTime.toLocaleTimeString()} -{' '}
          {timeslot.endTime.toLocaleTimeString()})
        </Button>
      ))}
    </div>
  )
}

export default TimeSlotPicker
