import { RouteComponentProps } from '@reach/router';
import { Col, Row, PageHeader, Alert, List, Icon } from 'antd';
import * as React from 'react';
import { Organization, EscapeRoom } from '@bookaquest/interfaces';
import { useLoading, useI18n, classNames } from '@bookaquest/utilities';
import { PageContent } from '../../shared/layout/PageContent';
import { useUser } from '../../shared/hooks/useUser';
import * as api from '../../api/application';
import { Section } from '../../shared/layout/Section';
import { environment } from '../../../environments/environment';
import OrganizationIntegration from './OrganizationIntegration';
import EscapeRoomIntegration from './EscapeRoomIntegration';

export function IntegrationPage(props: RouteComponentProps) {
  const { t } = useI18n();
  const { memberships } = useUser();

  const membership = memberships?.[0];
  const organizationId = membership?.organization;

  const [organization, setOrganization] = React.useState<Organization>();
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);
  const [roomsLoading, withRoomsLoading] = useLoading(true);
  const [organizationLoading, withOrganizationLoading] = useLoading(true);

  const [selectedRoom, setSelectedRoom] = React.useState<EscapeRoom>();
  const [selectedOrganization, setSelectedOrganization] = React.useState<
    Organization
  >();

  React.useEffect(() => {
    if (organizationId) {
      withOrganizationLoading(
        api.getOrganization(organizationId).then(setOrganization)
      );
      withRoomsLoading(api.getEscapeRooms(organizationId).then(setEscapeRooms));
    }
  }, [organizationId, withRoomsLoading, withOrganizationLoading]);

  const handleSelect = (item: EscapeRoom | Organization) => {
    if ('organization' in item) {
      setSelectedOrganization(undefined);
      setSelectedRoom(item);
    } else {
      setSelectedRoom(undefined);
      setSelectedOrganization(item);
    }
  };

  return (
    <PageContent header={<PageHeader title={t`Integration`} />} noBackground>
      <Row gutter={24}>
        <Col xxl={12}>
          <Section title={t`Link & button integration`}>
            <List
              bordered
              loading={organizationLoading || roomsLoading}
              itemLayout="horizontal"
              pagination={{
                pageSize: 10
              }}
              dataSource={
                organization ? [organization, ...escapeRooms] : escapeRooms
              }
              renderItem={item => (
                <List.Item
                  className={classNames(
                    'cursor-pointer',
                    (item._id === selectedRoom?._id ||
                      item._id === selectedOrganization?._id) &&
                      'bg-geekblue-100'
                  )}
                  onClick={() => handleSelect(item)}
                >
                  {!('organization' in item) && (
                    <Icon type="apartment" className="mr-4 text-2xl" />
                  )}
                  <List.Item.Meta
                    title={<strong>{item.name}</strong>}
                    description={
                      'organization' in item
                        ? `${environment.bookingAppUrl}/booking/${item.organization}/${item._id}`
                        : `${environment.bookingAppUrl}/booking/${item._id}`
                    }
                  />
                </List.Item>
              )}
            />
          </Section>
        </Col>
        <Col xxl={12}>
          <Section title={t`Embed`}>
            {!selectedRoom && !selectedOrganization && (
              <Alert
                className="mb-2"
                message={t`Select a room or organization. A link and integration code will appear here.`}
                type="info"
                showIcon
              />
            )}

            {selectedOrganization && (
              <OrganizationIntegration organization={selectedOrganization} />
            )}

            {selectedRoom && (
              <EscapeRoomIntegration escapeRoom={selectedRoom} />
            )}
          </Section>
        </Col>
      </Row>
    </PageContent>
  );
}
