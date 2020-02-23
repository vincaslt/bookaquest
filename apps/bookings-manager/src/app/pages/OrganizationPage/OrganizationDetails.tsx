import { Typography } from 'antd';
import * as React from 'react';
import { Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { DetailsItem } from '../../shared/components/DetailsList/DetailsItem';
import { DetailsList } from '../../shared/components/DetailsList/DetailsList';
import { EditableText } from '../../shared/components/EditableText';
import { Section } from '../../shared/layout/Section';

const { Text } = Typography;

interface Props {
  loading: boolean;
  organization?: Organization;
  onUpdateOrganization: (organization: Organization) => void;
}

// TODO: add support for URL slugs (based on name, for esc. room and organization)
export function OrganizationDetails({
  loading,
  organization,
  onUpdateOrganization
}: Props) {
  const { t } = useI18n();

  const handleChange = (key: 'name' | 'website' | 'location') => (
    value: string
  ) =>
    organization &&
    api
      .updateOrganization(organization._id, { [key]: value })
      .then(onUpdateOrganization);

  return (
    <Section title={t`Organization details`}>
      <DetailsList loading={loading}>
        <DetailsItem label={t`ID:`}>
          <Text copyable>{organization?._id}</Text>
        </DetailsItem>
        <DetailsItem label={t`Name:`}>
          <EditableText
            className="inline-flex items-center"
            onChange={handleChange('name')}
          >
            {organization?.name}
          </EditableText>
        </DetailsItem>
        <DetailsItem label={t`Website:`}>
          <EditableText onChange={handleChange('website')}>
            {organization?.website}
          </EditableText>
        </DetailsItem>
        <DetailsItem label={t`Location:`}>
          <EditableText onChange={handleChange('location')}>
            {organization?.location}
          </EditableText>
        </DetailsItem>
      </DetailsList>
    </Section>
  );
}
