import {
  Form,
  FormItem,
  Input,
  InputNumber,
  ResetButton,
  SubmitButton
} from '@jbuschke/formik-antd'
import { Col, notification, Row } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import * as Yup from 'yup'
import EscapeRoomCard from '~/../commons/components/EscapeRoomCard'
import {
  CreateEscapeRoom as CreateEscapeRoomType,
  EscapeRoom
} from '~/../commons/interfaces/escapeRoom'
import * as api from '../../../api/application'

const StyledResetButton = styled(ResetButton)`
  margin-right: 16px;
`

const initialValues: CreateEscapeRoomType = {
  name: '',
  description: '',
  location: '',
  price: 0,
  images: []
}

interface Props {
  organizationId: string
  onCreateDone: (escapeRoom: EscapeRoom) => void
  onCancel: () => void
}

// TODO: image upload, validation
// TODO: location same as organization location
function CreateEscapeRoom({ organizationId, onCreateDone, onCancel }: Props) {
  const { t } = useTranslation()

  const validationSchema = Yup.object().shape<CreateEscapeRoomType>({
    name: Yup.string().required(),
    description: Yup.string().required(),
    location: Yup.string().required(),
    price: Yup.number()
      .positive()
      .required(),
    images: Yup.array()
      .of(Yup.string())
      .required()
  })

  const handleSubmit = (
    values: CreateEscapeRoomType,
    actions: FormikActions<CreateEscapeRoomType>
  ) => {
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
      {({ values }) => (
        <Row gutter={24}>
          <Col span={10}>
            <Form layout="vertical">
              <FormItem name="name" hasFeedback label={t('Name')}>
                <Input name="name" />
              </FormItem>

              <FormItem name="location" hasFeedback label={t('Location')}>
                <Input name="location" />
              </FormItem>

              <FormItem name="description" hasFeedback label={t('Description')}>
                <Input.TextArea name="description" rows={4} />
              </FormItem>

              <FormItem name="price" hasFeedback label={t('Price')}>
                <InputNumber name="price" min={0} />
              </FormItem>

              <FormItem name="images" hasFeedback label={t('Images')}>
                <Input name="images[0]" />
              </FormItem>

              <FormItem name="action">
                <StyledResetButton onClick={onCancel} disabled={false}>
                  {t('Cancel')}
                </StyledResetButton>
                <SubmitButton>{t('Create')}</SubmitButton>
              </FormItem>
            </Form>
          </Col>
          <Col span={6}>
            <EscapeRoomCard
              escapeRoom={{
                ...values,
                images: values.images.length > 0 ? values.images : ['https://placehold.it/532x320']
              }}
            />
          </Col>
        </Row>
      )}
    </Formik>
  )
}

export default CreateEscapeRoom
