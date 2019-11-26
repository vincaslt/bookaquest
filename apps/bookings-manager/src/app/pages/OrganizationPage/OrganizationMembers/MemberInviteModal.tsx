import * as React from 'react';
import { Modal } from 'antd';
import { Formik } from 'formik';
import { Form, Input, FormItem } from 'formik-antd';
import * as Yup from 'yup';
import { InviteOrganizationMember } from '../../../interfaces/organizationMember';
import { useI18n } from '@bookaquest/utilities';

interface Props {
  visible: boolean;
  close: () => void;
}

interface ModalProps extends Props {
  resetForm: () => void;
  submitForm: () => void;
}

function MemberInviteModal({
  visible,
  close,
  resetForm,
  submitForm
}: ModalProps) {
  const { t } = useI18n();

  React.useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <Modal
      title={t`Invite member`}
      visible={visible}
      onOk={submitForm}
      onCancel={close}
    >
      <Form>
        <FormItem name="email" hasFeedback label={t`Email`}>
          <Input name="email" />
        </FormItem>
      </Form>
    </Modal>
  );
}

function FormWrapper({ close, ...rest }: Props) {
  const validationSchema = Yup.object().shape<InviteOrganizationMember>({
    email: Yup.string()
      .email()
      .required()
  });

  const initialValues: InviteOrganizationMember = {
    email: ''
  };

  const handleSubmit = () => {
    // TODO: send invitation
    close();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, resetForm }) => (
        <MemberInviteModal
          close={close}
          submitForm={submitForm}
          resetForm={resetForm}
          {...rest}
        />
      )}
    </Formik>
  );
}

export { FormWrapper as MemberInviteModal };
