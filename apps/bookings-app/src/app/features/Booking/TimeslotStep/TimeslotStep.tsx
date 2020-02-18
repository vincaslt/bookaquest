import { FormItem, Form, InputNumber, SubmitButton } from 'formik-antd';
import { Formik } from 'formik';
import * as React from 'react';
import { EscapeRoom, Timeslot, CreateBooking } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as Yup from 'yup';
import TimeslotInput from './TimeslotInput';

export type TimeslotInfo = Pick<CreateBooking, 'participants'> & {
  timeslot: Timeslot;
};

interface Props {
  room: EscapeRoom;
  timeslotInfo?: TimeslotInfo;
  onSelect: (info: TimeslotInfo) => void;
}

export function TimeslotStep({ room, onSelect, timeslotInfo }: Props) {
  const { t } = useI18n();

  const initialValues: TimeslotInfo = timeslotInfo || {
    participants: room.participants[0],
    timeslot: {} as Timeslot
  };

  const validationSchema = Yup.object().shape<TimeslotInfo>({
    participants: Yup.number()
      .required()
      .min(room.participants[0])
      .max(room.participants[1]),
    timeslot: Yup.object<Timeslot>({
      start: Yup.date().required(),
      end: Yup.date().required(),
      price: Yup.number().required()
    }).required()
  });

  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      onSubmit={onSelect}
      validationSchema={validationSchema}
    >
      {({ setFieldValue, isValid, values }) => (
        <Form>
          <FormItem name="participants" hasFeedback label={t`Participants`}>
            <InputNumber name="participants" />
          </FormItem>
          <TimeslotInput
            room={room}
            timeslot={values.timeslot}
            participants={values.participants}
            initialTimeslot={timeslotInfo?.timeslot}
            onSelectTimeslot={value => {
              setFieldValue('timeslot', value);
            }}
          />
          <SubmitButton disabled={!isValid}>{t`Continue`}</SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
