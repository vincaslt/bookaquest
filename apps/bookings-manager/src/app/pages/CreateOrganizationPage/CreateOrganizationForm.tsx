import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { CreateOrganization } from '../../interfaces/organization';
import { UserMembership } from '../../interfaces/user';

const StyledForm = styled(Form)`
  max-width: 512px;
  width: 100%;
`;

interface Props {
  onCreateOrganization: (memberships: UserMembership[]) => void;
}

export function CreateOrganizationForm({ onCreateOrganization }: Props) {
  const { t } = useI18n();

  const initialValues: CreateOrganization = {
    name: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const validationSchema = Yup.object().shape<CreateOrganization>({
    name: Yup.string().required()
  });

  const handleSubmit = (
    values: CreateOrganization,
    actions: FormikHelpers<CreateOrganization>
  ) => {
    api
      .createOrganization(values)
      .then(onCreateOrganization)
      .catch(() => actions.setSubmitting(false));
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <StyledForm layout="vertical">
        <FormItem name="name" hasFeedback label={t`Organization name`}>
          <Input name="name" />
        </FormItem>

        <FormItem name="action">
          <SubmitButton>{t`Create`}</SubmitButton>
        </FormItem>
      </StyledForm>
    </Formik>
  );
}
