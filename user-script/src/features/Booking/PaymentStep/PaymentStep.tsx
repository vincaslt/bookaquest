import { Button } from 'antd/lib/radio'
import * as React from 'react'

interface Props {
  onPaymentDone: () => void
}

function PaymentStep({ onPaymentDone }: Props) {
  return <Button onClick={onPaymentDone}>Finish</Button>
}

export default PaymentStep
