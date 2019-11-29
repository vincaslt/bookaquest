import * as React from 'react';
import { OrganizationInvitation } from '../../../interfaces/organizationMember';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import { Trans } from 'react-i18next';
import { Button, Alert } from 'antd';
import { UserMembership } from '../../../interfaces/user';

interface Props {
  invitation: OrganizationInvitation;
  onAccept: (
    memberships: UserMembership[],
    invitations: OrganizationInvitation[]
  ) => void;
  onCancel: (invitations: OrganizationInvitation[]) => void;
}

export function Invitation({ invitation, onAccept, onCancel }: Props) {
  const { t } = useI18n();

  const handleAcceptClick = async () => {
    const { invitations, memberships } = await api.acceptInvitation(
      invitation._id
    );
    onAccept(memberships, invitations);
  };

  const handleCancelClick = () => {
    // TODO: implement
    onCancel([]);
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
        onClick={handleCancelClick}
        className="mr-2"
      >{t`Reject`}</Button>
      <Button type="primary" onClick={handleAcceptClick}>{t`Accept`}</Button>
    </div>
  );
}
