import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  Rate,
  ResetButton,
  SubmitButton,
  Switch
} from 'formik-antd';
import { Col, Icon, notification, Row } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import {
  Organization,
  EscapeRoom,
  CreateEscapeRoom,
  PricingType,
  BusinessHours
} from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { EscapeRoomCard } from '@bookaquest/components';
import { RangeNumberInput } from '../../shared/components/RangeNumberInput';
import * as api from '../../api/application';
import { environment } from '../../../environments/environment';

const StyledResetButton = styled(ResetButton)`
  margin-right: 16px;
`;

interface Props {
  organization: Organization;
  onCreateDone: (escapeRoom: EscapeRoom) => void;
  onCancel: () => void;
}

// TODO: image upload, validation
// TODO: location same as organization location
// TODO: translated validation messages for forms
export function CreateEscapeRoomForm({
  organization,
  onCreateDone,
  onCancel
}: Props) {
  const { t } = useI18n();

  const initialValues: CreateEscapeRoom = {
    name: '',
    description: '',
    location: organization.location ?? '',
    price: 0,
    images: [],
    interval: 60,
    participants: [],
    timezone:
      organization.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone, // TODO: timezone and business hours may NOT exist, add input fields for those
    businessHours: organization.businessHours ?? [],
    difficulty: 1,
    paymentEnabled: false,
    pricingType: PricingType.FLAT
  };

  const validationSchema = Yup.object().shape<CreateEscapeRoom>({
    name: Yup.string().required(),
    description: Yup.string().required(),
    location: Yup.string().required(),
    pricingType: Yup.string()
      .oneOf(Object.values(PricingType))
      .required() as Yup.Schema<PricingType>,
    price: Yup.number()
      .required()
      .positive(),
    images: Yup.array()
      .of(Yup.string())
      .required(),
    participants: Yup.array()
      .of(Yup.number())
      .required()
      .test(
        'rangeTest',
        'Invalid range',
        ([from, to]: [number, number]) => from <= to
      ),
    interval: Yup.number()
      .required()
      .min(10),
    difficulty: Yup.number()
      .required()
      .min(1)
      .max(5),
    timezone: Yup.string().required(),
    paymentEnabled: Yup.boolean().required(),
    businessHours: Yup.array()
      .of(
        Yup.object<BusinessHours>({
          weekday: Yup.number().required(),
          hours: Yup.array()
            .of(Yup.number())
            .required()
        })
      )
      .required()
  });

  const handleSubmit = (
    values: CreateEscapeRoom,
    actions: FormikHelpers<CreateEscapeRoom>
  ) => {
    api
      .createEscapeRoom(organization._id, values)
      .then(escapeRoom => {
        notification.open({
          message: t`Success`,
          type: 'success',
          description: t`Escape room has been created`
        });
        onCreateDone(escapeRoom);
      })
      .catch(() => {
        actions.setSubmitting(false);
        notification.open({
          message: t`Error`,
          type: 'error',
          description: t`Please try again in a moment`
        });
      });
  };

  // TODO: show error / disallow, when organization has no working hours (or show a working hours picker)
  // TODO: validate accept payments in backend - to have payment codes first
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, setFieldTouched }) => (
        <Row gutter={24}>
          <Col span={10}>
            <Form layout="vertical">
              <FormItem name="name" hasFeedback label={t`Name`}>
                <Input name="name" />
              </FormItem>

              <FormItem name="location" hasFeedback label={t`Location`}>
                <Input name="location" />
              </FormItem>

              <FormItem name="description" hasFeedback label={t`Description`}>
                <Input.TextArea name="description" rows={4} />
              </FormItem>

              <FormItem name="difficulty" hasFeedback label={t`Difficulty`}>
                <Rate
                  allowClear={false}
                  name="difficulty"
                  character={<Icon type="lock" theme="filled" />}
                />
              </FormItem>

              <FormItem name="interval" hasFeedback label={t`Interval`}>
                <InputNumber name="interval" min={10} />
              </FormItem>

              <FormItem name="participants" hasFeedback label={t`Participants`}>
                <RangeNumberInput
                  name="participants"
                  min={0}
                  value={values.participants as [number?, number?]}
                  onChange={value => setFieldValue('participants', value)}
                  onBlur={() => setFieldTouched('participants', true)}
                  placeholder={[t`From`, t`To`]}
                />
              </FormItem>

              <FormItem name="images" hasFeedback label={t`Images`}>
                <Input name="images[0]" />
              </FormItem>

              <FormItem name="price" hasFeedback label={t`Price`}>
                <InputNumber name="price" min={0} />
              </FormItem>

              <FormItem name="pricingType" hasFeedback label={t`Pricing type`}>
                <Radio.Group
                  disabled={values.price === 0}
                  name="pricingType"
                  defaultValue={PricingType.FLAT}
                >
                  <Radio.Button
                    value={PricingType.FLAT}
                  >{t`Flat`}</Radio.Button>
                  <Radio.Button
                    value={PricingType.PER_PERSON}
                  >{t`Per-person`}</Radio.Button>
                </Radio.Group>
              </FormItem>

              {environment.paymentEnabled && (
                <FormItem
                  name="paymentsEnabled"
                  hasFeedback
                  label={t`Accept payments`}
                >
                  <Switch
                    name="paymentEnabled"
                    disabled={!organization.paymentDetails}
                  />
                </FormItem>
              )}

              <FormItem name="action">
                <StyledResetButton onClick={onCancel} disabled={false}>
                  {t`Cancel`}
                </StyledResetButton>
                <SubmitButton>{t`Create`}</SubmitButton>
              </FormItem>
            </Form>
          </Col>
          <Col span={6}>
            <EscapeRoomCard
              escapeRoom={{
                ...values,
                images:
                  values.images.length > 0
                    ? values.images
                    : ['https://placehold.it/532x320']
              }}
            />
          </Col>
        </Row>
      )}
    </Formik>
  );
}
