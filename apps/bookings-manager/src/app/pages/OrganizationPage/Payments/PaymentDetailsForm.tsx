import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import { Col, Row } from 'antd';
import { Formik } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { CreatePaymentDetails, Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../../api/application';

// TODO: They are always updated together and can't be edited, inform user about this
const initialValues: CreatePaymentDetails = {
  paymentClientKey: '',
  paymentSecretKey: ''
};

const validationSchema = Yup.object().shape<CreatePaymentDetails>({
  paymentClientKey: Yup.string().required(),
  paymentSecretKey: Yup.string().required()
});

interface Props {
  organizationId: string;
  onUpdateDone: (value: Organization) => void;
}

export function PaymentDetailsForm({ organizationId, onUpdateDone }: Props) {
  const { t } = useI18n();

  const handleSubmit = (paymentDetails: CreatePaymentDetails) => {
    api
      .updateOrganization(organizationId, { paymentDetails })
      .then(onUpdateDone);
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
          <FormItem name="paymentClientKey" hasFeedback label={t`Client key`}>
            <Input name="paymentClientKey" />
          </FormItem>
          <FormItem name="paymentSecretKey" hasFeedback label={t`Secret key`}>
            <Input name="paymentSecretKey" />
          </FormItem>
          <Row>
            <Col push={6}>
              <SubmitButton>{t`Save`}</SubmitButton>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
