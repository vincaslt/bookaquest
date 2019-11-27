import { List, Button } from 'antd';
import * as React from 'react';
import { useLoading, useI18n } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import { OrganizationMember } from '../../../interfaces/organizationMember';
import { Link } from '../../../shared/components/Link';
import { Section } from '../../../shared/layout/Section';
import { MemberInviteModal } from './MemberInviteModal';

interface Props {
  organizationId: string;
}

export function OrganizationMembers({ organizationId }: Props) {
  const [loading, withLoading] = useLoading(true);
  const [members, setMembers] = React.useState<OrganizationMember[]>([]);
  const [isInviteModalVisible, setInviteModalVisible] = React.useState(false);
  const { t } = useI18n();

  React.useEffect(() => {
    withLoading(api.getOrganizationMembers(organizationId).then(setMembers));
  }, [organizationId, withLoading]);

  const handleInviteClick = () => setInviteModalVisible(true);

  return (
    <Section
      title={t`Members`}
      extra={
        <Button type="link" onClick={handleInviteClick}>{t`Invite`}</Button>
      }
    >
      <MemberInviteModal
        organizationId={organizationId}
        visible={isInviteModalVisible}
        close={() => setInviteModalVisible(false)}
      />
      <List loading={loading}>
        {members.map(member => (
          <List.Item
            key={member._id}
            actions={[
              !member.isOwner && <Link key="remove-user">{t`remove`}</Link>
            ]}
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
    </Section>
  );
}
