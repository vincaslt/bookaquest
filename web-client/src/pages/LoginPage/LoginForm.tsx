import { Form, FormItem, Input, SubmitButton } from '@jbuschke/formik-antd'
import { notification } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import * as api from '../../api/application'
import { SignIn } from '../../interfaces/auth'

const initialValues: SignIn = {
  email: '',
  password: ''
}

function LoginForm() {
  const { t } = useTranslation()

  const validationSchema = Yup.object().shape<SignIn>({
    email: Yup.string().required(),
    password: Yup.string().required()
  })

  const handleSubmit = (values: SignIn, actions: FormikActions<SignIn>) => {
    api
      .signIn(values)
      .then(({ accessToken, refreshToken }) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        notification.open({
          message: t('Success'),
          type: 'success',
          description: t('Logged in successfully')
        })
      })
      .catch(() => {
        notification.open({
          message: t('Error'),
          type: 'error',
          description: t('Invalid credentials')
        })
      })
      .finally(() => {
        actions.setSubmitting(false)
      })
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormItem name="email" hasFeedback label={t('Email')}>
          <Input name="email" type="email" />
        </FormItem>

        <FormItem name="password" hasFeedback label={t('Password')}>
          <Input type="password" name="password" />
        </FormItem>
        <SubmitButton>{t('Sign in')}</SubmitButton>
      </Form>
    </Formik>
  )
}

export default LoginForm
