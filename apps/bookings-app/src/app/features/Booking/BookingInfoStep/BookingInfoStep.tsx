import 'react-phone-number-input/style.css';
import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import { Col, Row } from 'antd';
import { Formik } from 'formik';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import { EscapeRoom, CreateBooking } from '@bookaquest/interfaces';
import Phone from 'react-phone-number-input';

export type BookingInfo = Pick<CreateBooking, 'name' | 'phoneNumber' | 'email'>;

interface Props {
  room: EscapeRoom;
  bookingInfo?: BookingInfo;
  onSubmit: (info: BookingInfo) => void;
}

// ! TODO: form validation
export function BookingInfoStep({ onSubmit, room, bookingInfo }: Props) {
  const { t } = useI18n();

  const initialValues: BookingInfo = bookingInfo || {
    name: '',
    phoneNumber: '',
    email: ''
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ setFieldValue, values }) => (
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
          <FormItem name="name" hasFeedback label={t`Full name`}>
            <Input name="name" />
          </FormItem>
          <FormItem name="email" hasFeedback label={t`Email`}>
            <Input type="email" name="email" />
          </FormItem>
          <FormItem name="phoneNumber" hasFeedback label={t`Phone number`}>
            <Phone
              numberInputProps={{ className: 'ant-input' }}
              onChange={value => setFieldValue('phoneNumber', value)}
              value={values.phoneNumber}
            />
          </FormItem>
          <Row>
            <Col push={6}>
              <SubmitButton>{t`Continue`}</SubmitButton>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
