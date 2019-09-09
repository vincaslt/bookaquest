import { Button } from 'antd'
import * as React from 'react'
import { EscapeRoom } from '../../../interfaces/escapeRoom'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'

interface Props {
  bookingInfo: BookingInfo
  escapeRoom: EscapeRoom
  onSubmit: () => void
}

function ConfirmationStep({ escapeRoom, bookingInfo, onSubmit }: Props) {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = () => {
    setLoading(true)
    onSubmit()
  }

  return (
    <>
      <div>EscapeRoom: {JSON.stringify(escapeRoom)}</div>
      <div>Info: {JSON.stringify(bookingInfo)}</div>
      <Button type="primary" loading={loading} onClick={handleSubmit}>
        Confirm
      </Button>
    </>
  )
}

export default ConfirmationStep
