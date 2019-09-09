import { Button, Result } from 'antd'
import * as React from 'react'
import { EscapeRoom } from '../../../interfaces/escapeRoom'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'

interface Props {
  bookingInfo: BookingInfo
  escapeRoom: EscapeRoom
}

function SuccessStep({ bookingInfo, escapeRoom }: Props) {
  return (
    <Result
      status="success"
      title={`Successfully booked "${escapeRoom.name}"`}
      subTitle={`Booking details will be sent to ${bookingInfo.email}`}
      extra={[
        <Button type="primary" key="close">
          Close
        </Button>
      ]}
    />
  )
}

export default SuccessStep
