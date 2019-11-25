import { RouteComponentProps, Redirect } from '@reach/router';
import { Button, Col, PageHeader, Row } from 'antd';
import * as React from 'react';
import { EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { Link } from '../../shared/components/Link';
import { PageContent } from '../../shared/layout/PageContent';
import { PrivateRoutes } from '../../constants/routes';
import { EscapeRoomEditSection } from './EscapeRoomEditSection';
import { EarningsSection } from './EarningsSection/EarningsSection';
import { BookingsSection } from './BookingsSection';

interface UrlParams {
  escapeRoomId: string;
}

export function EscapeRoomPage({
  escapeRoomId
}: RouteComponentProps<UrlParams>) {
  const { t } = useI18n();
  const [escapeRoom, setEscapeRoom] = React.useState<EscapeRoom>();

  React.useEffect(() => {
    if (escapeRoomId) {
      api.getEscapeRoom(escapeRoomId).then(setEscapeRoom);
    }
  }, [escapeRoomId]);

  if (!escapeRoomId) {
    return <Redirect to={PrivateRoutes.EscapeRooms} />;
  }

  // TODO: generate lots of test data for escape room bookings
  // TODO: proper URL for booking page
  return (
    <PageContent
      header={
        escapeRoom && (
          <PageHeader
            title={escapeRoom.name}
            extra={
              <Link
                href={`http://localhost:3000/${escapeRoom.organization}/${escapeRoom._id}`}
                newTab
              >
                <Button type="link">{t`Go to booking page`}</Button>
              </Link>
            }
          />
        )
      }
      noBackground
      loading={!escapeRoom}
    >
      <Row gutter={16}>
        <Col span={16}>
          <EscapeRoomEditSection
            escapeRoom={escapeRoom}
            setEscapeRoom={setEscapeRoom}
          />
        </Col>
        <Col span={8}>
          <EarningsSection escapeRoomId={escapeRoomId} />
          <BookingsSection escapeRoomId={escapeRoomId} />
        </Col>
      </Row>
    </PageContent>
  );
}
