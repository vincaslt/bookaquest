import { Alert, Button, Input, notification } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import * as React from 'react';
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe,
  ReactStripeElements
} from 'react-stripe-elements';
import './CardForm.css';
import { asString, useI18n } from '@bookaquest/utilities';

interface Props extends ReactStripeElements.InjectedStripeProps {
  onSubmit: (token: stripe.Token) => void;
  loading: boolean;
}

// TODO: proper validations and form handling
export const CardForm = injectStripe(({ onSubmit, loading, stripe }: Props) => {
  const { t } = useI18n();
  const [name, setName] = React.useState('');

  const handleSubmit = async () => {
    if (!stripe) {
      return; // TODO: show notification?
    }

    const { token } = await stripe.createToken({ name });

    // TODO: use Message instead of notifications
    if (!token) {
      notification.open({
        message: t`Error`,
        type: 'error',
        description: t`This card cannot be used, try a different one`
      });
      return;
    }
    onSubmit(token);
  };

  return (
    <>
      <Alert
        type="warning"
        message={t`Your card will be charged`}
        description={t`Your booking will be completed after payment`}
      />
      <FormItem style={{ marginBottom: 15 }} label={t`Name on card`}>
        <Input
          placeholder={t`Name Surname`}
          value={name}
          onChange={asString(setName)}
        />
      </FormItem>
      <FormItem style={{ marginBottom: 0 }} label={t`Card number`}>
        <CardNumberElement
          classes={{
            base: 'ant-input stripe-card-input',
            focus: 'ant-input--focus'
          }}
          className="mb-1"
        />
      </FormItem>
      <div className="flex">
        <FormItem
          style={{ marginBottom: 0 }}
          label={t`Expiry date`}
          className="flex-1 mr-4"
        >
          <CardExpiryElement
            className="mr-2"
            classes={{
              base: 'ant-input stripe-card-input',
              focus: 'ant-input--focus'
            }}
          />
        </FormItem>
        <FormItem style={{ marginBottom: 0 }} label={t`CVC`} className="flex-1">
          <CardCVCElement
            classes={{
              base: 'ant-input stripe-card-input',
              focus: 'ant-input--focus'
            }}
          />
        </FormItem>
      </div>

      <Button
        loading={loading}
        className="mt-2 mr-4"
        type="primary"
        onClick={handleSubmit}
      >
        {t`Pay`}
      </Button>
    </>
  );
});
