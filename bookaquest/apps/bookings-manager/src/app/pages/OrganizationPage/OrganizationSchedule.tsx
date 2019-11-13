import { AutoComplete, Form, FormItem, SubmitButton } from 'formik-antd';
import { Button, notification, Spin } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { useToggle } from 'react-use';
import { listTimeZones } from 'timezone-support';
import * as api from '../../api/application';
import { BusinessHours, Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { SectionTitle } from '../../shared/components/SectionTitle';
import { WorkHours } from '@bookaquest/components';
import { BusinessHoursInput } from '../../shared/components/BusinessHoursInput';
import { Link } from '../../shared/components/Link';

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

// TODO: form validation
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

    try {
      const updatedOrg = await api.updateOrganization(
        organization.id,
        schedule
      );
      setOrganization(updatedOrg);
      notification.open({
        message: t`Success`,
        type: 'success',
        description: t`Organization business hours have been updated`
      });
      toggleEditing(false);
    } catch (e) {
      notification.open({
        message: t`Success`,
        type: 'error',
        description: t`Failed to update business hours, try again later`
      });
    }
    actions.setSubmitting(false);
  };

  if (!editing) {
    return (
      <>
        <div className="flex justify-between">
          <SectionTitle>{t`Business hours`}</SectionTitle>
          {organization && (
            <Button type="link" onClick={toggleEditing}>{t`Edit`}</Button>
          )}
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
          organization && (
            <WorkHours businessHours={organization.businessHours} />
          )
        )}
      </>
    );
  }

  const initialValues: CreateSchedule = {
    businessHours: (organization && organization.businessHours) || [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  return (
    <>
      <div className="flex justify-between">
        <SectionTitle>{t`Business hours`}</SectionTitle>
        <div>
          <Link onClick={toggleEditing}>{t`Cancel`}</Link>
        </div>
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
                setFieldValue('businessHours', value);
              }}
            />
            <SubmitButton>{t`Submit`}</SubmitButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
