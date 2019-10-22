import { Form, FormItem, Input, InputNumber, SubmitButton } from '@jbuschke/formik-antd'
import { Col, Row } from 'antd'
import { Formik } from 'formik'
import * as React from 'react'
import { CreateBooking } from '~/../commons/interfaces/booking'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { useI18n } from '~/../commons/utils/i18n'

export type BookingInfo = Omit<
  CreateBooking,
  'startDate' | 'endDate' | 'escapeRoomId' | 'paymentToken'
>

interface Props {
  room: EscapeRoom
  onSubmit: (info: BookingInfo) => void
}

// TODO: form validation
function BookingInfoStep({ onSubmit, room }: Props) {
  const { t } = useI18n()

  const initialValues: BookingInfo = {
    name: '',
    phoneNumber: '',
    email: '',
    participants: room.participants[0]
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values }) => (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
          <FormItem name="name" hasFeedback label={t`Full name`}>
            <Input name="name" />
          </FormItem>
          <FormItem name="email" hasFeedback label={t`Email`}>
            <Input type="email" name="email" />
          </FormItem>
          <FormItem name="phoneNumber" hasFeedback label={t`Phone number`}>
            <Input type="tel" name="phoneNumber" />
          </FormItem>
          <FormItem name="participants" hasFeedback label={t`Participants`}>
            <InputNumber
              name="participants"
              min={room.participants[0]}
              max={room.participants[1]}
            />
          </FormItem>
          <Row>
            <Col push={6}>
              <SubmitButton>{t`Continue`}</SubmitButton>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )
}

export default BookingInfoStep
