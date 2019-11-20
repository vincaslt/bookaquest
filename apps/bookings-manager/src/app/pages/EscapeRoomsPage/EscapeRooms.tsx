import { navigate } from '@reach/router';
import { Col, List, Row } from 'antd';
import AspectRatio from 'react-aspect-ratio';
import * as React from 'react';
import styled from 'styled-components';
import { Organization, EscapeRoom } from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';
import { EscapeRoomCard } from '@bookaquest/components';
import * as api from '../../api/application';
import { getUrl, PrivateRoutes } from '../../constants/routes';
import { Section } from '../../shared/layout/Section';
import { CreateEscapeRoomForm } from './CreateEscapeRoomForm';
import { NoEscapeRooms } from './NoEscapeRooms';

const NewEscapeRoomCard = styled.button`
  background-color: white;
  color: rgba(0, 0, 0, 0.45);
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  transition: border-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: #40a9ff;
  }
`;

interface Props {
  organization?: Organization;
}

export function EscapeRooms({ organization }: Props) {
  const { t } = useI18n();
  const [isLoading, withLoading] = useLoading(true);
  const [isCreating, setIsCreating] = React.useState(false);
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([]);

  const organizationId = organization?._id;

  React.useEffect(() => {
    if (organizationId) {
      withLoading(api.getEscapeRooms(organizationId).then(setEscapeRooms));
    }
  }, [organizationId, withLoading]);

  const handleCreateClick = () => setIsCreating(true);
  const handleCancel = () => setIsCreating(false);
  const handleCreateDone = (escapeRoom: EscapeRoom) => {
    setEscapeRooms(rooms => [...rooms, escapeRoom]);
    setIsCreating(false);
  };

  if (isCreating && organization) {
    return (
      <Section>
        <CreateEscapeRoomForm
          onCancel={handleCancel}
          onCreateDone={handleCreateDone}
          organization={organization}
        />
      </Section>
    );
  }

  const handleSelectRoom = (escapeRoom: EscapeRoom) =>
    navigate(
      getUrl(PrivateRoutes.EscapeRoom, { escapeRoomId: escapeRoom._id })
    );

  return escapeRooms.length > 0 || isLoading ? (
    <Row gutter={24}>
      <Col>
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
          loading={isLoading || !organization}
          dataSource={[...escapeRooms, 'new']}
          renderItem={item => (
            <List.Item>
              {typeof item === 'string' ? (
                <AspectRatio ratio="532/320">
                  <NewEscapeRoomCard onClick={handleCreateClick}>
                    {t`New Escape Room`}
                  </NewEscapeRoomCard>
                </AspectRatio>
              ) : (
                <EscapeRoomCard onSelect={handleSelectRoom} escapeRoom={item} />
              )}
            </List.Item>
          )}
        />
      </Col>
    </Row>
  ) : (
    <Section>
      <NoEscapeRooms onClickCTA={handleCreateClick} />
    </Section>
  );
}
