import * as React from 'react';
import { Organization } from '@bookaquest/interfaces';
import { StripeProvider, Elements } from 'react-stripe-elements';

interface Props {
  organization: Organization;
  children: React.ReactNode;
}

export function OrganizationStripeProvider({ organization, children }: Props) {
  const [stripe, setStripe] = React.useState<stripe.Stripe | null>(null);

  React.useEffect(() => {
    if (!organization.paymentDetails) {
      return;
    }

    if (window.Stripe) {
      setStripe(window.Stripe(organization.paymentDetails.paymentClientKey));
    } else {
      document.querySelector('#stripe-js')?.addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        if (organization.paymentDetails) {
          setStripe(
            window.Stripe(organization.paymentDetails.paymentClientKey)
          );
        }
      });
    }
  }, [organization.paymentDetails]);

  return (
    <>
      {organization.paymentDetails ? (
        <StripeProvider stripe={stripe}>
          <Elements>{children}</Elements>
        </StripeProvider>
      ) : (
        children
      )}
    </>
  );
}
