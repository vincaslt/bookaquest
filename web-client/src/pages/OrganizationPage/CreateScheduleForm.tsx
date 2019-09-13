import { Form, FormItem, Slider, SubmitButton, TreeSelect } from '@jbuschke/formik-antd'
import { Col, notification, Row, TreeSelect as antdTreeSelect } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '../../api/application'

const { TreeNode } = antdTreeSelect

interface CreateSchedule {
  weekDays: number[]
  workHours: [number, number] // TODO: could also be extended to multiple ranges after
}

const initialValues: CreateSchedule = {
  weekDays: [],
  workHours: [9, 17]
}

interface Props {
  organizationId: string
}

// TODO: use moment weekdays
// TODO: divide work hours by interval */
function CreateScheduleForm({ organizationId }: Props) {
  const { t } = useTranslation()

  const handleSubmit = (schedule: CreateSchedule, actions: FormikActions<CreateSchedule>) =>
    api
      .updateOrganization(organizationId, schedule)
      .then(() => {
        notification.open({
          message: t('Success'),
          type: 'success',
          description: t('Organization has been created')
        })
      })
      .finally(() => actions.setSubmitting(false))

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <FormItem name="weekDays" hasFeedback label={t('Weekdays')}>
              <TreeSelect name="weekDays" treeCheckable placeholder={t('Weekdays')}>
                <TreeNode value={1} title="Monday" />
                <TreeNode value={2} title="Tuesday" />
                <TreeNode value={3} title="Wednesday" />
                <TreeNode value={4} title="Thursday" />
                <TreeNode value={5} title="Friday" />
                <TreeNode value={6} title="Saturday" />
                <TreeNode value={7} title="Sunday" />
              </TreeSelect>
            </FormItem>
          </Col>
        </Row>
        <FormItem name="workHours" hasFeedback label={t('Work hours')}>
          <Slider
            name="workHours"
            marks={{
              0: '0',
              1: '1',
              2: '2',
              3: '3',
              4: '4',
              5: '5',
              6: '6',
              7: '7',
              8: '8',
              9: '9',
              10: '10',
              11: '11',
              12: '12',
              13: '13',
              14: '14',
              15: '15',
              16: '16',
              17: '17',
              18: '18',
              19: '19',
              20: '20',
              21: '21',
              22: '22',
              23: '23',
              24: '24'
            }}
            range
            max={24}
            step={0.5}
          />
        </FormItem>
        <FormItem name="action">
          <SubmitButton>{t('Submit')}</SubmitButton>
        </FormItem>
      </Form>
    </Formik>
  )
}

export default CreateScheduleForm
