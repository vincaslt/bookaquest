import { ErrorMessage, Field, Form, Formik, FormikActions } from 'formik'
import * as React from 'react'
import * as api from './api/application'
import { CreateBooking } from './interfaces/createBooking'

enum Routes {
  Booking = 'booking'
}

const initialValues: CreateBooking = {
  escapeRoomId: '',
  startDate: new Date(),
  endDate: new Date(),
  name: '',
  phoneNumber: '',
  email: ''
}

// TODO check organization ID for undefined
// TODO show availabilities, and escape room selection
function App() {
  const urlParts = window.location.pathname.split('/')
  const route = urlParts[1]
  const organizationId = urlParts[2]

  React.useEffect(() => {
    if (route === Routes.Booking) {
      api.getEscapeRooms(organizationId)
    }
  }, [])

  const handleSubmit = (values: CreateBooking, { setSubmitting }: FormikActions<CreateBooking>) =>
    api.createBooking(values).finally(() => setSubmitting(false))

  return (
    route === Routes.Booking && (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field name="name" />
            <ErrorMessage name="name" component="div" />

            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />

            <Field type="tel" name="phoneNumber" />
            <ErrorMessage name="phoneNumber" component="div" />

            <Field name="escapeRoomId" />
            <ErrorMessage name="escapeRoomId" component="div" />

            <Field type="date" name="startDate" />
            <ErrorMessage name="startDate" component="div" />

            <Field type="date" name="endDate" />
            <ErrorMessage name="endDate" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    )
  )
}

export default App
