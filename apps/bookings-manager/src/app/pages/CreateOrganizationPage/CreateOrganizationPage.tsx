import * as React from 'react';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { Section } from '../../shared/layout/Section';
import { CreateOrganizationSplash } from './CreateOrganizationSplash';
import { CreateOrganizationForm } from './CreateOrganizationForm';
import { Invitation } from './Invitation';

// TODO: to create organization you must pay
export function CreateOrganizationPage() {
  const { setMemberships, invitations, setInvitations } = useUser();

  return (
    <PageContent noBackground className="flex flex-col items-center">
      <Section className="w-full max-w-3xl flex flex-col items-center">
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
      </Section>
    </PageContent>
  );
}
