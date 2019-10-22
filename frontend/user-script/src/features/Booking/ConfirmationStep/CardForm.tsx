import * as React from 'react'
import { CardCVCElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements'
import './CardForm.css'

function CardForm() {
  return (
    <div>
      <CardNumberElement
        classes={{ base: 'ant-input stripe-card-input', focus: 'ant-input--focus' }}
        className="mb-1"
      />
      <div className="flex">
        <CardExpiryElement
          className="mr-2"
          classes={{ base: 'ant-input stripe-card-input', focus: 'ant-input--focus' }}
        />
        <CardCVCElement
          classes={{ base: 'ant-input stripe-card-input', focus: 'ant-input--focus' }}
        />
      </div>
    </div>
  )
}

export default CardForm
