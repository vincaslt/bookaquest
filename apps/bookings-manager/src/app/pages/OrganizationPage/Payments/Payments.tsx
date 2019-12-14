import * as React from 'react';
import { Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { DetailsItem } from '../../../shared/components/DetailsList/DetailsItem';
import { DetailsList } from '../../../shared/components/DetailsList/DetailsList';
import { Link } from '../../../shared/components/Link';
import { Section } from '../../../shared/layout/Section';
import { PaymentDetailsForm } from './PaymentDetailsForm';

interface Props {
  organization?: Organization;
  setOrganization: (organization: Organization) => void;
}

export function Payments({ organization, setOrganization }: Props) {
  const { t } = useI18n();

  const [editing, setEditing] = React.useState(false);

  const details = organization?.paymentDetails;
  const isEditing = editing || !details;

  const handleToggleEditing = () => setEditing(!isEditing);
  const handleUpdateDone = (org: Organization) => {
    setOrganization(org);
    setEditing(false);
  };

  return isEditing && organization ? (
    <Section title={t`Stripe payment details`}>
      <PaymentDetailsForm
        organizationId={organization._id}
        onUpdateDone={handleUpdateDone}
      />
    </Section>
  ) : (
    <Section
      title={t`Stripe payment details`}
      extra={
        <Link onClick={handleToggleEditing}>
          {isEditing ? t`Cancel` : t`Edit`}
        </Link>
      }
    >
      <DetailsList loading={!organization}>
        <DetailsItem label={t`Client key:`}>
          {details && details.paymentClientKey}
        </DetailsItem>
        <DetailsItem label={t`Secret key:`}>'*********'</DetailsItem>
      </DetailsList>
    </Section>
  );
}
