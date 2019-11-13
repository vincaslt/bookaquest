import { RouteComponentProps } from '@reach/router';
import { Col, Row } from 'antd';
import * as React from 'react';
import * as api from '../../api/application';
import { useUser } from '../../shared/hooks/useUser';
import { PageContent } from '../../shared/layout/PageContent';
import { Section } from '../../shared/layout/Section';
import { CreateOrganization } from './CreateOrganization/CreateOrganization';
import { OrganizationDetails } from './OrganizationDetails';
import { OrganizationMembers } from './OrganizationMembers';
import { OrganizationSchedule } from './OrganizationSchedule';
import { Payments } from './Payments/Payments';
import { Organization } from '@bookaquest/interfaces';
import { useLoading } from '@bookaquest/utilities';

// TODO: let user pick organizations / multiple organizations support
export function OrganizationPage(props: RouteComponentProps) {
  const { userInfo } = useUser();

  const membership = userInfo && userInfo.memberships[0]; // TODO: use selected, instead of first one
  const organizationId = membership && membership.organizationId;

  const [organization, setOrganization] = React.useState<Organization>();
  const [loading, withLoading] = useLoading(true);

  React.useEffect(() => {
    if (organizationId) {
      withLoading(api.getOrganization(organizationId).then(setOrganization));
    }
  }, [organizationId, withLoading]);

  return (
    <PageContent noBackground>
      {membership ? (
        <>
          <Row gutter={24}>
            <Col span={8}>
              <Section>
                <OrganizationDetails
                  loading={loading}
                  organization={organization}
                  onUpdateOrganization={setOrganization}
                />
              </Section>

              <Section>
                <OrganizationSchedule
                  organization={organization}
                  loading={loading}
                  setOrganization={setOrganization}
                />
              </Section>
            </Col>
            <Col span={8}>
              <Section>
                <OrganizationMembers
                  organizationId={membership.organizationId}
                />
              </Section>
            </Col>
            <Col span={8}>
              <Section>
                <Payments
                  organization={organization}
                  setOrganization={setOrganization}
                />
              </Section>
            </Col>
          </Row>
        </>
      ) : (
        <CreateOrganization />
      )}
    </PageContent>
  );
}
