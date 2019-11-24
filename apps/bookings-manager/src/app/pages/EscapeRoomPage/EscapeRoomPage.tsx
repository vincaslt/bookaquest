import { RouteComponentProps } from '@reach/router';
import { Button, Col, PageHeader, Row } from 'antd';
import { addWeeks, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import * as React from 'react';
import { EscapeRoom, Booking } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import dec from 'ramda/es/dec';
import inc from 'ramda/es/inc';
import * as api from '../../api/application';
import { Link } from '../../shared/components/Link';
import { PageContent } from '../../shared/layout/PageContent';
import { EscapeRoomEditSection } from './EscapeRoomEditSection';
import { EarningsSection } from './EarningsSection/EarningsSection';

interface UrlParams {
  escapeRoomId: string;
}

export function EscapeRoomPage({
  escapeRoomId
}: RouteComponentProps<UrlParams>) {
  const { t, dateFnsLocale } = useI18n();
  const [escapeRoom, setEscapeRoom] = React.useState<EscapeRoom>();
  const [todaysBookings, setTodaysBookings] = React.useState<Booking[]>();
  const [weeklyBookings, setWeeklyBookings] = React.useState<Booking[]>();
  const [weekOffset, setWeekOffset] = React.useState(0);

  React.useEffect(() => {
    if (escapeRoomId) {
      api.getEscapeRoom(escapeRoomId).then(setEscapeRoom);
    }
  }, [escapeRoomId]);

  React.useEffect(() => {
    const now = new Date();
    const week = addWeeks(now, weekOffset);

    if (escapeRoomId) {
      api
        .getEscapeRoomBookings(
          escapeRoomId,
          startOfWeek(week, { locale: dateFnsLocale }),
          endOfWeek(week, { locale: dateFnsLocale })
        )
        .then(bookings => {
          if (weekOffset === 0) {
            setTodaysBookings(
              bookings.filter(booking => isSameDay(now, booking.endDate))
            );
          }
          setWeeklyBookings(bookings);
        });
    }
  }, [weekOffset, escapeRoomId, dateFnsLocale]);

  const nextWeek = () => setWeekOffset(inc);
  const prevWeek = () => setWeekOffset(dec);

  // TODO: generate lots of test data for escape room bookings
  // TODO: bookings section should show paginated bookings ordered by date
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
      {escapeRoom && (
        <Row gutter={16}>
          <Col span={16}>
            <EscapeRoomEditSection
              escapeRoom={escapeRoom}
              setEscapeRoom={setEscapeRoom}
            />
          </Col>
          <Col span={8}>
            <EarningsSection
              todaysBookings={todaysBookings}
              weeklyBookings={weeklyBookings}
              week={addWeeks(new Date(), weekOffset)}
              onNextWeek={nextWeek}
              onPrevWeek={prevWeek}
            />
            {/* <Section title={t`Bookings`}>
              <List
                loading={!bookings}
                itemLayout="horizontal"
                dataSource={bookings}
                renderItem={booking => (
                  <List.Item>
                    <List.Item.Meta
                      title={booking.name}
                      description={booking.startDate.toLocaleString()}
                    />
                  </List.Item>
                )}
              />
            </Section> */}
          </Col>
        </Row>
      )}
    </PageContent>
  );
}
