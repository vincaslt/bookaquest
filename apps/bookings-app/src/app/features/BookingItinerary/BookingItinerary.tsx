import { green, grey } from '@ant-design/colors';
import { Col, Icon, Result, Row, Spin, Steps, Typography } from 'antd';
import { isAfter } from 'date-fns';
import { Trans } from 'react-i18next';
import { useRoute } from 'wouter';
import { useMedia } from 'react-use';
import styled from 'styled-components';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import {
  BookingWithEscapeRoom,
  Organization,
  BookingStatus
} from '@bookaquest/interfaces';
import { Time } from '@bookaquest/components';
import { getBooking, getOrganization } from '../../api/application';
import { RemainingTime } from './RemainingTime';

const { Text, Title } = Typography;

const GrayIcon = styled(Icon)`
  color: ${grey[0]} !important;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 0.125em;
`;

const SectionLoading = styled.div`
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;

  & > *:first-child {
    margin-bottom: 20px;
  }
`;

// TODO: add "link to this page"
// TODO: use Detail component? Or Description whatever
export function BookingItinerary() {
  const { t } = useI18n();
  const [, params] = useRoute('/itinerary/:bookingId');
  const [booking, setBooking] = React.useState<BookingWithEscapeRoom>();
  const [organization, setOrganization] = React.useState<Organization>();
  const isLargerScreen = useMedia('(min-width: 768px)');

  const bookingId = params && params.bookingId;

  React.useEffect(() => {
    const fetchBookingData = async (_bookingId: string) => {
      const _booking = await getBooking(_bookingId);
      const _organization = await getOrganization(
        _booking.escapeRoom.organization
      );
      setBooking(_booking);
      setOrganization(_organization);
    };

    if (bookingId) {
      fetchBookingData(bookingId);
    }
  }, [bookingId]);

  if (!booking || !organization) {
    return (
      <Row>
        <Col xxl={{ span: 18, push: 3 }} xl={{ span: 22, push: 1 }} span={24}>
          <SectionLoading>
            <Spin size="large" />
            <h2>{t`Loading...`}</h2>
          </SectionLoading>
        </Col>
      </Row>
    );
  }

  const escapeRoom = booking.escapeRoom;
  const isOutdated = isAfter(new Date(), booking.startDate);
  const isAccepted = booking.status === BookingStatus.Accepted;
  const isPending = booking.status === BookingStatus.Pending;

  const status = {
    [BookingStatus.Pending]: 'info' as 'info',
    [BookingStatus.Accepted]: 'success' as 'success',
    [BookingStatus.Rejected]: 'error' as 'error',
    [BookingStatus.Canceled]: 'error' as 'error'
  }[booking.status];

  const stepStatus = {
    [BookingStatus.Pending]: 'wait' as 'wait',
    [BookingStatus.Accepted]: 'finish' as 'finish',
    [BookingStatus.Rejected]: 'error' as 'error',
    [BookingStatus.Canceled]: 'error' as 'error'
  }[booking.status];

  const titleText = {
    [BookingStatus.Pending]: t`Booking request for "${escapeRoom.name}" has been received`,
    [BookingStatus.Accepted]: t`Booking for "${escapeRoom.name}" has been confirmed, see you in`,
    [BookingStatus.Rejected]: t`Booking for "${escapeRoom.name}" has been rejected`,
    [BookingStatus.Canceled]: t`Booking for "${escapeRoom.name}" has been canceled`
  }[booking.status];

  const subtitleText = {
    [BookingStatus.Pending]: t`The escape room operator will now review your booking and send you an email
                  confirmation with details to ${booking.email} once it's accepted. You can come back
                  to this page to check your booking status.`,
    [BookingStatus.Accepted]: <RemainingTime date={booking.startDate} />,
    [BookingStatus.Rejected]: booking.comment
      ? t`Comment: ${booking.comment}`
      : '',
    [BookingStatus.Canceled]: booking.comment
      ? t`Comment: ${booking.comment}`
      : ''
  }[booking.status];

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const successIcon = (
    <Icon
      className="mr-2"
      type="check-circle"
      theme="twoTone"
      twoToneColor={green.primary}
    />
  );

  return (
    <Row>
      <Col xxl={{ span: 18, offset: 3 }} xl={{ span: 22, offset: 1 }} span={24}>
        <Section>
          <Result
            icon={
              isOutdated ? (
                <GrayIcon type="minus-circle" theme="filled" />
              ) : (
                undefined
              )
            }
            status={isOutdated ? undefined : status}
            title={isOutdated ? t`Booking is no longer active` : titleText}
            subTitle={isOutdated ? undefined : subtitleText}
          >
            {!isOutdated && (
              <>
                <Row gutter={16}>
                  <Col lg={8} className="mb-4">
                    <Title level={4}>{t`Booking`}</Title>
                    {escapeRoom.timezone !== localTimeZone && (
                      <div>
                        <Text strong className="mr-2">{t`Timezone:`}</Text>
                        {escapeRoom.timezone}
                      </div>
                    )}
                    <div>
                      <Text strong className="mr-2">{t`Date:`}</Text>
                      <Time
                        date={[booking.startDate, booking.endDate]}
                        type={{ format: 'PPPp' }}
                        timeZone={escapeRoom.timezone}
                      />
                    </div>
                    <div>
                      <Text strong className="mr-2">{t`Name:`}</Text>
                      {booking.name}
                    </div>
                    <pre>
                      <Text copyable>
                        <Text strong className="mr-2">{t`ID:`}</Text>
                        {booking._id}
                      </Text>
                    </pre>
                  </Col>
                  <Col lg={8} className="mb-4">
                    <Title level={4}>{t`Place`}</Title>
                    <div>
                      <Text strong className="mr-2">{t`Escape room:`}</Text>
                      {booking.escapeRoom.name}
                    </div>
                    <div>
                      <Text strong className="mr-2">{t`Operator:`}</Text>
                      <Text>{organization.name}</Text>
                    </div>
                    <div>
                      <Text strong className="mr-2">{t`Location:`}</Text>
                      <Text>{escapeRoom.location}</Text>
                    </div>
                  </Col>
                  <Col lg={8} className="mb-4">
                    <Title level={4}>{t`Contacts`}</Title>
                    <div>
                      <Text strong className="mr-2">{t`Email:`}</Text>
                      <Text>{organization.email}</Text>
                    </div>
                    <div>
                      <Text strong className="mr-2">{t`Phone:`}</Text>
                      <Text>{organization.phoneNumber}</Text>
                    </div>
                    <div>
                      <Text strong className="mr-2">{t`Website:`}</Text>
                      <Text>{organization.website}</Text>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-8">
                  <Col>
                    <Steps
                      progressDot
                      direction={isLargerScreen ? 'horizontal' : 'vertical'}
                      current={isAccepted ? 2 : 1}
                      status={stepStatus}
                    >
                      <Steps.Step
                        title={
                          <span className="flex items-center">
                            {(isAccepted || isPending) && successIcon}
                            {t`Book`}
                          </span>
                        }
                        description={t`Booking details have been filled`}
                      />
                      <Steps.Step
                        title={
                          <span className="flex items-center">
                            {isAccepted && successIcon}
                            {escapeRoom.paymentEnabled
                              ? t`Payment`
                              : t`Confirmation`}
                          </span>
                        }
                        description={
                          escapeRoom.paymentEnabled
                            ? t`Payment has been made`
                            : t`You will receive it in your email soon`
                        }
                      />
                      <Steps.Step
                        title="Play!"
                        description={
                          <Trans>
                            Show up on{' '}
                            <Time
                              date={booking.startDate}
                              type={{ format: 'PPPp' }}
                              timeZone={escapeRoom.timezone}
                            />
                          </Trans>
                        }
                      />
                    </Steps>
                  </Col>
                </Row>
              </>
            )}
          </Result>
        </Section>
      </Col>
    </Row>
  );
}
