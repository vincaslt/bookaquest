import { List, Button, Divider, Popconfirm, Icon, message } from 'antd';
import { format } from 'date-fns';
import { red } from '@ant-design/colors';
import * as React from 'react';
import { useLoading, useI18n } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import {
  OrganizationMember,
  MemberInvitation,
  InvitationStatus
} from '../../../interfaces/organizationMember';
import { Section } from '../../../shared/layout/Section';
import { useUser } from '../../../shared/hooks/useUser';
import { MemberInviteModal } from './MemberInviteModal';

interface Props {
  organizationId: string;
}

export function OrganizationMembers({ organizationId }: Props) {
  const { t, dateFnsLocale } = useI18n();
  const [loading, withLoading] = useLoading(true);
  const { userInfo } = useUser();
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
  const handleDeleteClick = (membership: OrganizationMember) => async () => {
    setMemberships(_memberships =>
      _memberships.filter(({ _id }) => _id !== membership._id)
    );
    await api.deleteOrganizationMember(organizationId, membership._id);
    message.success(t`Removed ${membership.user.fullName} from organization`);
  };

  const pendingInvitations = invitations.filter(
    invitation => invitation.status === InvitationStatus.PENDING
  );

  const isUserOwner = memberships.some(
    ({ isOwner, user }) => user._id === userInfo?._id && isOwner
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
            actions={
              isUserOwner
                ? [
                    <Popconfirm
                      disabled={membership.isOwner}
                      title={t`Are you sure?`}
                      onConfirm={handleDeleteClick(membership)}
                      okText={t`Yes`}
                      cancelText={t`Cancel`}
                      icon={
                        <Icon
                          type="question-circle-o"
                          style={{ color: red[5] }}
                        />
                      }
                    >
                      <Button
                        type="link"
                        key="remove-user"
                        disabled={membership.isOwner}
                      >{t`remove`}</Button>
                    </Popconfirm>
                  ]
                : undefined
            }
          >
            <List.Item.Meta
              title={membership.user.fullName}
              description={membership.user.email}
            />
            {membership.isOwner ? (
              <strong className="px-2">{t`Owner`}</strong>
            ) : (
              <div className="px-2">{t`Member`}</div>
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
