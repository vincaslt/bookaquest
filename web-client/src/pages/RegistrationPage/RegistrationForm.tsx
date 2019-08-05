import { Form, FormItem, Input, SubmitButton } from '@jbuschke/formik-antd'
import { notification } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import * as api from '../../api/application'
import { CreateUser } from '../../interfaces/user'

const initialValues: CreateUser = {
  email: '',
  fullName: '',
  password: ''
}

function RegistrationForm() {
  const { t } = useTranslation()

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
        notification.open({
          message: t('Success'),
          type: 'success',
          description: t('User has been created')
        })
      })
      .catch(() => {
        notification.open({
          message: t('Error'),
          type: 'error',
          description: t('Please try again in a moment')
        })
      })
      .finally(() => actions.setSubmitting(false))
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormItem name="fullName" hasFeedback label={t('Full name')}>
          <Input name="fullName" />
        </FormItem>

        <FormItem name="email" hasFeedback label={t('Email')}>
          <Input name="email" type="email" />
        </FormItem>

        <FormItem name="password" hasFeedback label={t('Password')}>
          <Input type="password" name="password" />
        </FormItem>
        <SubmitButton>{t('Register')}</SubmitButton>
      </Form>
    </Formik>
  )
}

export default RegistrationForm
