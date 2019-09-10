import { Form, FormItem, Input, SubmitButton } from '@jbuschke/formik-antd'
import { Col, Row } from 'antd'
import { Formik } from 'formik'
import * as React from 'react'
import { CreateBooking } from '../../../interfaces/booking'

export type BookingInfo = Pick<CreateBooking, 'email' | 'name' | 'phoneNumber'>

const initialValues: BookingInfo = {
  name: '',
  phoneNumber: '',
  email: ''
}

interface Props {
  onSubmit: (info: BookingInfo) => void
}

function BookingInfoStep({ onSubmit }: Props) {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {() => (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
          <FormItem name="name" hasFeedback label="Full name">
            <Input name="name" />
          </FormItem>

          <FormItem name="email" hasFeedback label="Email">
            <Input type="email" name="email" />
          </FormItem>

          <FormItem name="phoneNumber" hasFeedback label="Phone number">
            <Input type="tel" name="phoneNumber" />
          </FormItem>

          <Row>
            <Col push={6}>
              <SubmitButton>Submit</SubmitButton>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default BookingInfoStep
