import * as React from 'react';
import { Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { Section } from '../../shared/layout/Section';
import * as api from '../../api/application';
import { DetailsList } from '../../shared/components/DetailsList/DetailsList';
import { DetailsItem } from '../../shared/components/DetailsList/DetailsItem';
import { EditableText } from '../../shared/components/EditableText';

interface Props {
  organization?: Organization;
  loading: boolean;
  setOrganization: (organization: Organization) => void;
}

function OrganizationContacts({
  organization,
  loading,
  setOrganization
}: Props) {
  const { t } = useI18n();

  const handleChange = (
    key: 'phoneNumber' | 'website' | 'email' | 'location'
  ) => (value: string) =>
    organization &&
    api
      .updateOrganization(organization._id, { [key]: value })
      .then(setOrganization);

  return (
    <Section title={t`Organization contacts`}>
      <DetailsItem label={t`Location:`}>
        <EditableText onChange={handleChange('location')}>
          {organization?.location}
        </EditableText>
      </DetailsItem>
      <DetailsList loading={loading}>
        <DetailsItem label={t`Website:`}>
          <EditableText onChange={handleChange('website')}>
            {organization?.website}
          </EditableText>
        </DetailsItem>
        <DetailsItem label={t`Phone number:`}>
          <EditableText
            className="inline-flex items-center"
            onChange={handleChange('phoneNumber')}
          >
            {organization?.phoneNumber}
          </EditableText>
        </DetailsItem>
        <DetailsItem label={t`Email:`}>
          <EditableText onChange={handleChange('email')}>
            {organization?.email}
          </EditableText>
        </DetailsItem>
      </DetailsList>
    </Section>
  );
}

export default OrganizationContacts;
