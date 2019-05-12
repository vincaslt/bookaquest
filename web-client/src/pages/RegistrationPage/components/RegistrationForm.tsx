import { Form, FormItem, Input, SubmitButton } from '@jbuschke/formik-antd'
import { notification } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import * as api from '../../../api/application'
import { CreateUser } from '../../../interfaces/user'

const initialValues: CreateUser = {
  email: '',
  fullName: '',
  password: ''
}

function RegistrationForm() {
  const validationSchema = Yup.object().shape<CreateUser>({
    fullName: Yup.string().required(),
    email: Yup.string()
      .required()
      .email(),
    password: Yup.string()
      .required()
      .min(6)
  })

  const handleSubmit = (values: CreateUser, actions: FormikActions<CreateUser>) => {
    api
      .register(values)
      .then(() => {
        actions.setSubmitting(false)
        notification.open({
          message: 'Success',
          description: 'User has been created'
        })
      })
      .catch(() => {
        notification.open({
          message: 'Error',
          description: 'Please try again in a moment'
        })
      })
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormItem name="fullName" label="Full name">
          <Input name="fullName" />
        </FormItem>

        <FormItem name="email" label="Email">
          <Input name="email" type="email" />
        </FormItem>

        <FormItem name="password" label="Password">
          <Input type="password" name="password" />
        </FormItem>
        <SubmitButton>Register</SubmitButton>
      </Form>
    </Formik>
  )
}

export default RegistrationForm
