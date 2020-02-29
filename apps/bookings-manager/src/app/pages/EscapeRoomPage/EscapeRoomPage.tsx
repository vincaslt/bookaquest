import { RouteComponentProps, Redirect } from '@reach/router';
import { Button, Col, PageHeader, Row } from 'antd';
import * as React from 'react';
import { EscapeRoom } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import * as api from '../../api/application';
import { Link } from '../../shared/components/Link';
import { PageContent } from '../../shared/layout/PageContent';
import { PrivateRoutes } from '../../constants/routes';
import { environment } from '../../../environments/environment';
import { EscapeRoomEditSection } from './EscapeRoomEditSection';
import { EarningsSection } from './EarningsSection/EarningsSection';
import { EscapeRoomBookingsList } from './BookingsSection';

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
  return (
    <PageContent
      header={
        <PageHeader
          title={
            escapeRoom ? t`Escape Room "${escapeRoom.name}"` : t`Escape Room`
          }
          extra={
            escapeRoom && (
              <Link
                href={`${environment.bookingAppUrl}/booking/${escapeRoom.organization}/${escapeRoom._id}`}
                newTab
              >
                <Button type="link">{t`Go to booking page`}</Button>
              </Link>
            )
          }
        />
      }
      noBackground
      loading={!escapeRoom}
    >
      <Row gutter={16}>
        <Col xxl={14}>
          <EscapeRoomEditSection
            escapeRoom={escapeRoom}
            setEscapeRoom={setEscapeRoom}
          />
        </Col>
        <Col xxl={10}>
          <Row gutter={16}>
            <Col xxl={24} xl={12}>
              <EarningsSection escapeRoom={escapeRoom} />
            </Col>
            <Col xxl={24} xl={12}>
              <EscapeRoomBookingsList escapeRoom={escapeRoom} />
            </Col>
          </Row>
        </Col>
      </Row>
    </PageContent>
  );
}
