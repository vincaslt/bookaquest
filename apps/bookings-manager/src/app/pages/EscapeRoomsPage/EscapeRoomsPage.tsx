import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { Organization } from '@bookaquest/interfaces';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { EscapeRooms } from './EscapeRooms';

export function EscapeRoomsPage(props: RouteComponentProps) {
  const { memberships } = useUser();
  const [organization, setOrganization] = React.useState<Organization>();

  // TODO: use selected, instead of first one
  const organizationId = memberships?.[0]?.organization;

  React.useEffect(() => {
    if (organizationId) {
      api.getOrganization(organizationId).then(setOrganization);
    }
  }, [organizationId]);

  return (
    <PageContent noBackground>
      <EscapeRooms organization={organization} />
    </PageContent>
  );
}
