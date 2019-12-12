import { Row, Col } from 'antd';
import * as React from 'react';
import { Booking } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';
import { Section } from '../../../shared/layout/Section';
import { PendingBookings } from './PendingBookings';
import { UpcomingBookings } from './UpcomingBookings';

interface Props {
  bookings: Booking[];
  loading: boolean;
  updateBookings?: (bookings: Booking[]) => void;
  timeZone?: string;
}

export function BookingsSection({
  bookings,
  loading,
  updateBookings,
  timeZone
}: Props) {
  const { t } = useI18n();

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Section title={t`Upcoming Bookings`}>
          <UpcomingBookings
            bookings={bookings}
            loading={loading}
            timeZone={timeZone}
            updateBookings={updateBookings}
          />
        </Section>
      </Col>
      <Col span={12}>
        <Section title={t`Pending Bookings`}>
          <PendingBookings
            bookings={bookings}
            loading={loading}
            timeZone={timeZone}
            updateBookings={updateBookings}
          />
        </Section>
      </Col>
    </Row>
  );
}
