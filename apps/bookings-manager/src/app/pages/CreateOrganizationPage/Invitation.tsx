import { Trans } from 'react-i18next';
import { Button, Alert } from 'antd';
import * as React from 'react';
import { useI18n, useLoading } from '@bookaquest/utilities';
import { OrganizationInvitation } from '../../interfaces/organizationMember';
import * as api from '../../api/application';
import { UserMembership } from '../../interfaces/user';

interface Props {
  invitation: OrganizationInvitation;
  onAccept: (
    memberships: UserMembership[],
    invitations: OrganizationInvitation[]
  ) => void;
  onDecline: (invitations: OrganizationInvitation[]) => void;
}

export function Invitation({ invitation, onAccept, onDecline }: Props) {
  const { t } = useI18n();
  const [acceptLoading, withAcceptLoading] = useLoading();
  const [declineLoading, withDeclineLoading] = useLoading();

  const handleAcceptClick = async () => {
    const { invitations, memberships } = await withAcceptLoading(
      api.acceptInvitation(invitation._id)
    );
    onAccept(memberships, invitations);
  };

  const handleDeclineClick = async () => {
    const invitations = await withDeclineLoading(
      api.declineInvitation(invitation._id)
    );
    onDecline(invitations);
  };

  return (
    <div>
      <Alert
        showIcon
        message={t`Invitation pending`}
        description={
          <Trans>
            You have a pending invitation to
            <strong> {invitation.organization.name}</strong>
          </Trans>
        }
        className="mb-4"
      />
      <Button
        type="danger"
        onClick={handleDeclineClick}
        className="mr-2"
        loading={declineLoading}
      >{t`Decline`}</Button>
      <Button
        type="primary"
        onClick={handleAcceptClick}
        loading={acceptLoading}
      >{t`Accept`}</Button>
    </div>
  );
}
