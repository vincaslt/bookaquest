import { List, Button, Divider } from 'antd';
import { format } from 'date-fns';
import * as React from 'react';
import { useLoading, useI18n } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import {
  OrganizationMember,
  MemberInvitation,
  InvitationStatus
} from '../../../interfaces/organizationMember';
import { Link } from '../../../shared/components/Link';
import { Section } from '../../../shared/layout/Section';
import { MemberInviteModal } from './MemberInviteModal';

interface Props {
  organizationId: string;
}

// TODO: invitations request should return only pending?
export function OrganizationMembers({ organizationId }: Props) {
  const { t, dateFnsLocale } = useI18n();
  const [loading, withLoading] = useLoading(true);
  const [invitations, setInvitations] = React.useState<MemberInvitation[]>([]);
  const [memberships, setMemberships] = React.useState<OrganizationMember[]>(
    []
  );
  const [isInviteModalVisible, setInviteModalVisible] = React.useState(false);

  React.useEffect(() => {
    withLoading(
      api.getOrganizationMembers(organizationId).then(data => {
        setMemberships(data.memberships);
        setInvitations(data.invitations);
      })
    );
  }, [organizationId, withLoading]);

  const handleInviteClick = () => setInviteModalVisible(true);

  const pendingInvitations = invitations.filter(
    invitation => invitation.status === InvitationStatus.PENDING
  );

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
        onInvitationSent={setInvitations}
        close={() => setInviteModalVisible(false)}
      />
      <List loading={loading}>
        {memberships.map(membership => (
          <List.Item
            key={membership._id}
            actions={[
              !membership.isOwner && <Link key="remove-user">{t`remove`}</Link>
            ]}
          >
            <List.Item.Meta
              title={membership.user.fullName}
              description={membership.user.email}
            />
            {membership.isOwner ? (
              <strong>{t`Owner`}</strong>
            ) : (
              <div>{t`Member`}</div>
            )}
          </List.Item>
        ))}
      </List>
      {pendingInvitations.length > 0 && (
        <>
          <Divider>{t`Sent invitations`}</Divider>
          {pendingInvitations.map(invitation => (
            <List.Item key={invitation._id}>
              <List.Item.Meta
                title={invitation.user.fullName}
                description={invitation.user.email}
              />
              {
                <div>{t`Sent at ${format(invitation.createdAt, 'Pp', {
                  locale: dateFnsLocale
                })}`}</div>
              }
            </List.Item>
          ))}
        </>
      )}
    </Section>
  );
}
