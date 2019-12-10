import { List } from 'antd';
import { useRoute, useLocation } from 'wouter';
import * as React from 'react';
import { EscapeRoom } from '@bookaquest/interfaces';
import { EscapeRoomCard } from '@bookaquest/components';
import * as api from '../../api/application';

export function EscapeRoomSelect() {
  const [, params] = useRoute<{ organizationId: string }>(
    '/booking/:organizationId'
  );
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

  const handleSelectEscapeRoom = (room: EscapeRoom) =>
    setLocation(`booking/${organizationId}/${room._id}`);

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 4
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
  );
}
