import * as React from 'react'
// import { useEffect, useState } from 'preact/hooks'
import { FieldProps } from 'react-jsonschema-form'

// TODO: timezone
// interface TimeSlot {
//   startTime: Date
//   endTime: Date
//   info: {
//     title: string
//   }
// }

// interface Props {
//   timeslots: TimeSlot[]
//   onChange: (selected: TimeSlot | null) => void
// }

// interface FormData {
//   timeslot: TimeSlot
// }

function TimeSlotPicker(props: FieldProps) {
  // const [selected, setSelected] = useState<TimeSlot | undefined | null>(undefined)

  // const handleSelectTimeslot = (timeslot: TimeSlot) => () => setSelected(timeslot)

  // useEffect(() => {
  //   if (selected !== undefined) {
  //     onChange(selected)
  //   }
  // }, [selected])

  // return (
  //   <div>
  //     {timeslots.map((timeslot, i) => (
  //       <button key={i} type="button" onClick={handleSelectTimeslot(timeslot)}>
  //         {selected === timeslot && '=> '}
  //         {timeslot.info.title}
  //       </button>
  //     ))}
  //   </div>
  // )
  console.log(props)
  return <div key="asd">Custom</div> as React.ReactElement
}

export default TimeSlotPicker
