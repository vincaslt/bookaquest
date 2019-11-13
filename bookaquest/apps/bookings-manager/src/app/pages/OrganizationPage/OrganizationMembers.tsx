import { List } from 'antd';
import * as React from 'react';
import * as api from '../../api/application';
import { OrganizationMember } from '../../interfaces/organizationMember';
import { SectionTitle } from '../../shared/components/SectionTitle';
import { useLoading, useI18n } from '@bookaquest/utilities';
import { Link } from '../../shared/components/Link';

interface Props {
  organizationId: string;
}

export function OrganizationMembers({ organizationId }: Props) {
  const [loading, withLoading] = useLoading(true);
  const [members, setMembers] = React.useState<OrganizationMember[]>([]);
  const { t } = useI18n();

  React.useEffect(() => {
    withLoading(api.getOrganizationMembers(organizationId).then(setMembers));
  }, [organizationId, withLoading]);

  return (
    <>
      <SectionTitle>{t`Members`}</SectionTitle>
      <List loading={loading}>
        {members.map(member => (
          <List.Item
            key={member.userId}
            actions={[<Link key="remove-user">{t`remove`}</Link>]}
          >
            <List.Item.Meta
              title={member.user.fullName}
              description={member.user.email}
            />
            {member.isOwner ? (
              <strong>{t`Owner`}</strong>
            ) : (
              <div>{t`Member`}</div>
            )}
          </List.Item>
        ))}
      </List>
    </>
  );
}
