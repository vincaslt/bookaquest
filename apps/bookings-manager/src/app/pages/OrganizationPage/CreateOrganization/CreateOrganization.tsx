import * as React from 'react';
import { useUser } from '../../../shared/hooks/useUser';
import { PageContent } from '../../../shared/layout/PageContent';
import { CreateOrganizationSplash } from './CreateOrganizationSplash';
import { CreateOrganizationForm } from './CreateOrganizationForm';

export function CreateOrganization() {
  const { setMemberships } = useUser();

  return (
    <PageContent className="flex flex-col items-center">
      <CreateOrganizationSplash />
      <CreateOrganizationForm onCreateOrganization={setMemberships} />
    </PageContent>
  );
}
