import { Form, FormItem, Input, SubmitButton } from '@jbuschke/formik-antd'
import { Col, Row, Spin } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import styled from 'styled-components'
import * as api from './api/application'
import EscapeRoomPicker from './components/EscapeRoomPicker'
import { CreateBooking } from './interfaces/createBooking'
import { EscapeRoom } from './interfaces/escapeRoom'

const Section = styled.div`
  background: white;
  padding: 20px;
`

const initialValues: CreateBooking = {
  escapeRoomId: '',
  startDate: new Date(),
  endDate: new Date(),
  name: '',
  phoneNumber: '',
  email: ''
}

interface Props {
  organizationId: string
}

// TODO: three step form
// TODO check organization ID for undefined
// TODO show availabilities, and escape room selection
function BookingForm({ organizationId }: Props) {
  const [loading, setLoading] = React.useState(true)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  React.useEffect(() => {
    api
      .getEscapeRooms(organizationId)
      .then(setEscapeRooms)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = (values: CreateBooking, { setSubmitting }: FormikActions<CreateBooking>) =>
    api.createBooking(values).finally(() => setSubmitting(false))

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => (
        <Form>
          <Row gutter={24}>
            <Col span={12}>
              <Section>
                <FormItem name="name" hasFeedback label="Full name">
                  <Input name="name" />
                </FormItem>

                <FormItem name="email" hasFeedback label="Email">
                  <Input type="email" name="email" />
                </FormItem>

                <FormItem name="phoneNumber" hasFeedback label="Phone number">
                  <Input type="tel" name="phoneNumber" />
                </FormItem>
              </Section>
            </Col>
            <Col span={12}>
              <Section>
                {!loading ? (
                  <EscapeRoomPicker
                    selectedId={values.escapeRoomId}
                    onSelect={selectedId => setFieldValue('escapeRoomId', selectedId)}
                    escapeRooms={escapeRooms}
                  />
                ) : (
                  <Spin />
                )}
              </Section>
            </Col>
          </Row>

          {/* <Field name="escapeRoomId" />

            <Field type="date" name="startDate" />

            <Field type="date" name="endDate" /> */}

          <SubmitButton>Submit</SubmitButton>
        </Form>
      )}
    </Formik>
  )
}

export default BookingForm
