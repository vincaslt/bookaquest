import { Row, Col, Spin, Button } from 'antd';
import { addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import * as React from 'react';
import { Booking, EscapeRoom, Organization } from '@bookaquest/interfaces';
import { dec, inc } from 'ramda';
import { useI18n } from '@bookaquest/utilities';
import { Time } from '@bookaquest/components';
import * as api from '../../../api/application';
import { Section } from '../../../shared/layout/Section';
import { BookingsList } from '../../../shared/components/BookingsList';
import { PendingBookings } from './PendingBookings';
import { UpcomingBookings } from './UpcomingBookings';

interface Props {
  organization?: Organization;
  bookings: Booking[];
  loading: boolean;
  escapeRooms: EscapeRoom[];
  updateBookings?: (bookings: Booking[]) => void;
  onMoreDetails: (booking: Booking) => void;
}

export function BookingsSection({
  organization,
  bookings,
  loading,
  updateBookings,
  escapeRooms,
  onMoreDetails
}: Props) {
  const { t, dateFnsLocale } = useI18n();
  const [allBookings, setAllBookings] = React.useState<Booking[]>();
  const [weekOffset, setWeekOffset] = React.useState(0);

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZone = organization?.timezone ?? localTimeZone;

  React.useEffect(() => {
    if (!organization) {
      return;
    }

    const now = zonedTimeToUtc(new Date(), timeZone);
    const week = addWeeks(now, weekOffset);

    let isCancelled = false;

    api
      .getOrganizationBookings(organization._id, {
        from: zonedTimeToUtc(
          startOfWeek(week, { locale: dateFnsLocale }),
          timeZone
        ),
        to: zonedTimeToUtc(endOfWeek(week, { locale: dateFnsLocale }), timeZone)
      })
      .then(result => {
        if (!isCancelled) {
          setAllBookings(result);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [organization, timeZone, weekOffset, dateFnsLocale, bookings]); // bookings changed -> was accepted/rejected

  const renderRangeText = () => {
    const now = zonedTimeToUtc(new Date(), timeZone);
    const week = addWeeks(now, weekOffset);

    return (
      <Time
        type="date"
        date={[
          zonedTimeToUtc(
            startOfWeek(week, { locale: dateFnsLocale }),
            timeZone
          ),
          zonedTimeToUtc(endOfWeek(week, { locale: dateFnsLocale }), timeZone)
        ]}
        timeZone={timeZone}
      />
    );
  };

  return (
    <Row gutter={16}>
      <Col xl={10} xxl={12}>
        <Section title={t`Upcoming Bookings`}>
          <UpcomingBookings
            bookings={bookings}
            loading={loading}
            timeZone={timeZone}
            updateBookings={updateBookings}
            escapeRooms={escapeRooms}
            onMoreDetails={onMoreDetails}
          />
        </Section>
      </Col>
      <Col xl={14} xxl={12}>
        <Section title={t`Pending Bookings`}>
          <PendingBookings
            bookings={bookings}
            loading={loading}
            timeZone={timeZone}
            updateBookings={updateBookings}
            escapeRooms={escapeRooms}
            onMoreDetails={onMoreDetails}
          />
        </Section>
      </Col>

      <Col xl={{ span: 16, offset: 0 }} xxl={{ span: 14, offset: 0 }}>
        <Section title={t`Booking history`} extra={renderRangeText()}>
          {!allBookings ? (
            <div className="m-4 text-center">
              <Spin />
            </div>
          ) : (
            <div className="flex items-center">
              <Button
                className="flex justify-center mr-4"
                shape="circle"
                icon="left"
                onClick={() => setWeekOffset(dec)}
              />
              <div className="flex flex-grow px-4">
                <BookingsList
                  timeZone={timeZone}
                  bookings={allBookings}
                  onMoreDetails={onMoreDetails}
                  updateBookings={updateBookings}
                />
              </div>
              <Button
                className="flex justify-center ml-4"
                shape="circle"
                icon="right"
                onClick={() => setWeekOffset(inc)}
              />
            </div>
          )}
        </Section>
      </Col>
    </Row>
  );
}
