import { AutoComplete, Form, FormItem, SubmitButton } from '@jbuschke/formik-antd'
import { Button, Descriptions, notification, Spin } from 'antd'
import { Formik, FormikActions } from 'formik'
import * as React from 'react'
import { useToggle } from 'react-use'
import { listTimeZones } from 'timezone-support'
import WorkHours from '~/../commons/components/WorkHours'
import { BusinessHours } from '~/../commons/interfaces/businessHours'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import BusinessHoursInput from '../../shared/components/BusinessHoursInput'

interface CreateSchedule {
  businessHours: BusinessHours[]
  timezone: string
}

const timezoneOptions = listTimeZones()

interface Props {
  loading: boolean
  setOrganization: (organization: Organization) => void
  organization?: Organization
}

// TODO: form validation
function OrganizationSchedule({ organization, setOrganization, loading }: Props) {
  const { t } = useI18n()
  const [editing, toggleEditing] = useToggle(false)

  const handleSubmit = async (schedule: CreateSchedule, actions: FormikActions<CreateSchedule>) => {
    if (!organization) {
      return
    }

    try {
      const updatedOrg = await api.updateOrganization(organization.id, schedule)
      setOrganization(updatedOrg)
      notification.open({
        message: t`Success`,
        type: 'success',
        description: t`Organization business hours have been updated`
      })
      toggleEditing(false)
    } catch (e) {
      notification.open({
        message: t`Success`,
        type: 'error',
        description: t`Failed to update business hours, try again later`
      })
    }
    actions.setSubmitting(false)
  }

  if (!editing) {
    return (
      <>
        <div className="flex justify-between">
          <Descriptions title={t`Business Hours`} />
          {organization && <Button type="link" onClick={toggleEditing}>{t`Edit`}</Button>}
        </div>
        {organization && (
          <div className="mb-4">
            <span className="font-medium mr-2">{t`Timezone:`}</span>
            {organization.timezone}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center">
            <Spin />
          </div>
        ) : (
          organization && <WorkHours businessHours={organization.businessHours} />
        )}
      </>
    )
  }

  const initialValues: CreateSchedule = {
    businessHours: (organization && organization.businessHours) || [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  return (
    <>
      <div className="flex justify-between">
        <Descriptions title={t`Business Hours`} />
        <Button type="link" onClick={toggleEditing}>{t`Cancel`}</Button>
      </div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form layout="vertical">
            <FormItem name="timezone" hasFeedback label={t`Timezone`}>
              <AutoComplete name="timezone" dataSource={timezoneOptions} />
            </FormItem>
            <BusinessHoursInput
              value={values.businessHours}
              onChange={value => {
                setFieldValue('businessHours', value)
              }}
            />
            <FormItem name="action">
              <SubmitButton>{t`Submit`}</SubmitButton>
            </FormItem>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default OrganizationSchedule
