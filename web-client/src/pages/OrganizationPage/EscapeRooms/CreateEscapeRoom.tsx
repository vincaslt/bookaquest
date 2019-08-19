import { Form, FormItem, Input, ResetButton, SubmitButton } from '@jbuschke/formik-antd'
import { notification } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import * as Yup from 'yup'
import * as api from '../../../api/application'
import { CreateEscapeRoom, EscapeRoom } from '../../../interfaces/escapeRoom'

const StyledForm = styled(Form)`
  max-width: 512px;
  width: 100%;
`

const StyledResetButton = styled(ResetButton)`
  margin-right: 16px;
`

const initialValues: CreateEscapeRoom = {
  name: '',
  description: '',
  location: ''
}

interface Props {
  organizationId: string
  onCreateDone: (escapeRoom: EscapeRoom) => void
  onCancel: () => void
}

function CreateEscapeRoom({ organizationId, onCreateDone, onCancel }: Props) {
  const { t } = useTranslation()

  const validationSchema = Yup.object().shape<CreateEscapeRoom>({
    name: Yup.string().required(),
    description: Yup.string().required(),
    location: Yup.string().required()
  })

  const handleSubmit = (values: CreateEscapeRoom, actions: FormikActions<CreateEscapeRoom>) => {
    api
      .createEscapeRoom(organizationId, values)
      .then(escapeRoom => {
        notification.open({
          message: t('Success'),
          type: 'success',
          description: t('Escape room has been created')
        })
        onCreateDone(escapeRoom)
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

        <FormItem name="location" hasFeedback label={t('Location')}>
          <Input name="location" />
        </FormItem>

        <FormItem name="description" hasFeedback label={t('Description')}>
          <Input.TextArea name="description" rows={4} />
        </FormItem>

        <FormItem name="action">
          <StyledResetButton onClick={onCancel} disabled={false}>
            {t('Cancel')}
          </StyledResetButton>
          <SubmitButton>{t('Create')}</SubmitButton>
        </FormItem>
      </StyledForm>
    </Formik>
  )
}

export default CreateEscapeRoom
