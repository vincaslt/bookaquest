import { List, Row, Col } from 'antd';
import { useRoute, useLocation } from 'wouter';
import * as React from 'react';
import { EscapeRoom } from '@bookaquest/interfaces';
import { EscapeRoomCard } from '@bookaquest/components';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';

export function EscapeRoomSelect() {
  const [, params] = useRoute<{ organizationId: string }>(
    '/booking/:organizationId'
  );
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);

  const organizationId = params && params.organizationId;

  React.useEffect(() => {
    if (organizationId) {
      api
        .getEscapeRooms(organizationId)
        .then(setEscapeRooms)
        .finally(() => setLoading(false));
    } else {
      setEscapeRooms([]);
      setLoading(false);
    }
  }, [organizationId]);

  React.useEffect(() => {
    document.title = `Pick a Room - BookaQuest`;
  }, []);

  const handleSelectEscapeRoom = (room: EscapeRoom) =>
    setLocation(`booking/${organizationId}/${room._id}`);

  // TODO: math for calculating better 1,2,3,4 escape rooms grid placement
  return (
    <>
      <h1 className="text-3xl font-medium mb-8 text-center">{t`Pick a Room`}</h1>
      <Row className="bg-gray-300 p-12 pb-8 rounded-sm">
        <Col xxl={{ span: 16, push: 4 }}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3
            }}
            loading={loading}
            dataSource={escapeRooms}
            renderItem={escapeRoom => (
              <List.Item>
                <EscapeRoomCard
                  escapeRoom={escapeRoom}
                  onSelect={handleSelectEscapeRoom}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}
