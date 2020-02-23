import { RouteComponentProps } from '@reach/router';
import { PageHeader, Button } from 'antd';
import * as React from 'react';
import { Organization } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { Link } from '../../shared/components/Link';
import { environment } from '../../../environments/environment';
import { EscapeRooms } from './EscapeRooms';

export function EscapeRoomsPage(props: RouteComponentProps) {
  const { t } = useI18n();
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
    <PageContent
      header={
        <PageHeader
          title={t`Escape Rooms`}
          extra={
            organization && (
              <Link
                href={`${environment.bookingAppUrl}/booking/${organization._id}`}
                newTab
              >
                <Button type="link">{t`Go to organization booking page`}</Button>
              </Link>
            )
          }
        />
      }
      noBackground
    >
      <EscapeRooms organization={organization} />
    </PageContent>
  );
}
