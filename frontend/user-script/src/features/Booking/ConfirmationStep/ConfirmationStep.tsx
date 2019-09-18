import { Button } from 'antd'
import * as React from 'react'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'

interface Props {
  escapeRoom: EscapeRoom
  bookingInfo: BookingInfo
  timeslot: Timeslot
  onSubmit: () => void
}

function ConfirmationStep({ bookingInfo, escapeRoom, timeslot, onSubmit }: Props) {
  return (
    <>
      <div>bookingInfo: {JSON.stringify(bookingInfo)}</div>
      <div>escapeRoom: {JSON.stringify(escapeRoom)}</div>
      <div>timeslot: {JSON.stringify(timeslot)}</div>
      <Button type="primary" onClick={onSubmit}>
        Confirm
      </Button>
    </>
  )
}

export default ConfirmationStep
