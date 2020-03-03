import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import { message } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { navigate } from '@reach/router';
import * as React from 'react';
import * as Yup from 'yup';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { CreateUser } from '../../interfaces/user';
import { useUser } from '../../shared/hooks/useUser';
import { PrivateRoutes } from '../../constants/routes';

const initialValues: CreateUser = {
  email: '',
  fullName: '',
  password: ''
};

export function RegistrationForm() {
  const { t } = useI18n();
  const { login } = useUser();

  const validationSchema = Yup.object().shape<CreateUser>({
    fullName: Yup.string().required(),
    email: Yup.string()
      .required()
      .email(),
    password: Yup.string()
      .required()
      .min(6)
  });

  const handleSubmit = (
    values: CreateUser,
    actions: FormikHelpers<CreateUser>
  ) => {
    api
      .register(values)
      .then(() => navigate(PrivateRoutes.Bookings))
      .then(() => login({ email: values.email, password: values.password }))
      .catch(() => actions.setSubmitting(false));
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormItem name="fullName" hasFeedback label={t`Full name`}>
          <Input name="fullName" />
        </FormItem>

        <FormItem name="email" hasFeedback label={t`Email`}>
          <Input name="email" type="email" />
        </FormItem>

        <FormItem name="password" hasFeedback label={t`Password`}>
          <Input type="password" name="password" />
        </FormItem>
        <SubmitButton>{t`Register`}</SubmitButton>
      </Form>
    </Formik>
  );
}
