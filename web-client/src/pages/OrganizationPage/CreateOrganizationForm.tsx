import { Form, FormItem, Input, SubmitButton } from '@jbuschke/formik-antd'
import { notification } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import * as Yup from 'yup'
import * as api from '../../api/application'
import { CreateOrganization } from '../../interfaces/organization'
import { UserMembership } from '../../interfaces/user'

const StyledForm = styled(Form)`
  max-width: 512px;
  width: 100%;
`

const initialValues: CreateOrganization = {
  name: '',
  website: '',
  location: ''
}

interface Props {
  onCreateOrganization: (memberships: UserMembership[]) => void
}

function CreateOrganizationForm({ onCreateOrganization }: Props) {
  const { t } = useTranslation()

  const validationSchema = Yup.object().shape<CreateOrganization>({
    name: Yup.string().required(),
    website: Yup.string()
      .required()
      .url(),
    location: Yup.string().required()
  })

  const handleSubmit = (values: CreateOrganization, actions: FormikActions<CreateOrganization>) => {
    api
      .createOrganization(values)
      .then(memberships => {
        onCreateOrganization(memberships)
        notification.open({
          message: t('Success'),
          type: 'success',
          description: t('Organization has been created')
        })
      })
      .catch(() => {
        actions.setSubmitting(false)
        notification.open({
          message: t('Error'),
          type: 'error',
          description: t('Please try again in a moment')
        })
      })
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <StyledForm layout="vertical">
        <FormItem name="name" hasFeedback label={t('Name')}>
          <Input name="name" />
        </FormItem>

        <FormItem name="website" hasFeedback label={t('Website')}>
          <Input name="website" type="url" />
        </FormItem>

        <FormItem name="location" hasFeedback label={t('Location')}>
          <Input name="location" />
        </FormItem>

        <FormItem name="action">
          <SubmitButton>{t('Create')}</SubmitButton>
        </FormItem>
      </StyledForm>
    </Formik>
  )
}

export default CreateOrganizationForm
