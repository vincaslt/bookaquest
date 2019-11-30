import * as React from 'react';
import { useUser } from '../../../shared/hooks/useUser';
import { PageContent } from '../../../shared/layout/PageContent';
import { CreateOrganizationSplash } from './CreateOrganizationSplash';
import { CreateOrganizationForm } from './CreateOrganizationForm';
import { Invitation } from './Invitation';

// TODO: shold be able to view more invitations than one
// TODO: to create organization you must pay
export function CreateOrganization() {
  const { setMemberships, invitations, setInvitations } = useUser();

  return (
    <PageContent className="flex flex-col items-center">
      <CreateOrganizationSplash />
      {invitations?.length ? (
        <Invitation
          invitation={invitations[0]}
          onAccept={(mem, inv) => {
            setMemberships(mem);
            setInvitations(inv);
          }}
          onDecline={setInvitations}
        />
      ) : (
        <CreateOrganizationForm onCreateOrganization={setMemberships} />
      )}
    </PageContent>
  );
}
