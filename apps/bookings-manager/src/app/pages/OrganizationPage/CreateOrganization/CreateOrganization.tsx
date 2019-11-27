import * as React from 'react';
import { useUser } from '../../../shared/hooks/useUser';
import { PageContent } from '../../../shared/layout/PageContent';
import { CreateOrganizationSplash } from './CreateOrganizationSplash';
import { CreateOrganizationForm } from './CreateOrganizationForm';

// TODO: free users can't create organizations, only accept invitations, paid users must pay during organization creation
export function CreateOrganization() {
  const { setMemberships } = useUser();

  return (
    <PageContent className="flex flex-col items-center">
      <CreateOrganizationSplash />
      <CreateOrganizationForm onCreateOrganization={setMemberships} />
    </PageContent>
  );
}
