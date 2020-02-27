import { Select, Form, FormItem, SubmitButton } from 'formik-antd';
import { Button, Spin, message, Form as AntdForm } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { useToggle } from 'react-use';
import { listTimeZones } from 'timezone-support';
import * as React from 'react';
import { BusinessHours, Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { WorkHours } from '@bookaquest/components';
import * as api from '../../api/application';
import { BusinessHoursInput } from '../../shared/components/BusinessHoursInput';
import { Section } from '../../shared/layout/Section';

interface CreateSchedule {
  businessHours: BusinessHours[];
  timezone: string;
}

const timezoneOptions = listTimeZones();

interface Props {
  loading: boolean;
  setOrganization: (organization: Organization) => void;
  organization?: Organization;
}

export function OrganizationSchedule({
  organization,
  setOrganization,
  loading
}: Props) {
  const { t } = useI18n();
  const [editing, toggleEditing] = useToggle(false);

  const handleSubmit = async (
    schedule: CreateSchedule,
    actions: FormikHelpers<CreateSchedule>
  ) => {
    if (!organization) {
      return;
    }

    const updatedOrg = await api.updateOrganization(organization._id, schedule);
    setOrganization(updatedOrg);
    message.success(t`Organization business hours have been updated`);
    toggleEditing(false);
    actions.setSubmitting(false);
  };

  if (!editing) {
    return (
      <Section
        title={t`Business hours`}
        extra={
          organization && (
            <Button type="link" onClick={toggleEditing}>{t`Edit`}</Button>
          )
        }
      >
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
          organization && (
            <WorkHours businessHours={organization.businessHours} />
          )
        )}
      </Section>
    );
  }

  const initialValues: CreateSchedule = {
    businessHours: (organization && organization.businessHours) || [],
    timezone:
      organization?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  return (
    <Section
      title={t`Business hours`}
      extra={
        organization && (
          <Button type="link" onClick={toggleEditing}>{t`Cancel`}</Button>
        )
      }
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form layout="vertical">
            <FormItem name="timezone" hasFeedback label={t`Timezone`}>
              <Select name="timezone" showSearch optionFilterProp="children">
                {timezoneOptions.map(option => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <AntdForm.Item label={t`Weekdays`}>
              <BusinessHoursInput
                value={values.businessHours}
                onChange={value => {
                  setFieldValue('businessHours', value);
                }}
              />
            </AntdForm.Item>
            <SubmitButton>{t`Submit`}</SubmitButton>
          </Form>
        )}
      </Formik>
    </Section>
  );
}
