import {
  Alert,
  Button,
  Divider,
  Statistic,
  Typography,
  message,
  Row,
  Col
} from 'antd';
import { useLocation } from 'wouter';
import { Trans } from 'react-i18next';
import * as React from 'react';
import { EscapeRoom, CreateBooking, PricingType } from '@bookaquest/interfaces';
import { useI18n, useLoading, formatCurrency } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep';
import { TimeslotInfo } from '../TimeslotStep/TimeslotStep';
import { ContactInfo } from './Details/ContactInfo';
import { ReservationInfo } from './Details/ReservationInfo';
import { CardForm } from './StripeCardForm/CardForm';

const { Title } = Typography;

interface Props {
  escapeRoom: EscapeRoom;
  bookingInfo: BookingInfo;
  timeslotInfo: TimeslotInfo;
}

export function ConfirmationStep({
  bookingInfo,
  escapeRoom,
  timeslotInfo
}: Props) {
  const { t, locale } = useI18n();
  const [, setLocation] = useLocation();
  const [loading, withLoading, withFnLoading] = useLoading();

  const handleSubmit = async (token?: stripe.Token) => {
    const options: CreateBooking = {
      ...bookingInfo,
      participants: timeslotInfo.participants,
      startDate: timeslotInfo.timeslot.start,
      endDate: timeslotInfo.timeslot.end,
      escapeRoomId: escapeRoom._id
    };

    if (token && escapeRoom.paymentEnabled) {
      options.paymentToken = token.id;
    }

    const { _id } = await api.createBooking(options).catch(e => {
      message.error(t`Error creating a reservation, please try again later`);
      throw e;
    });
    // TODO: handle error
    setLocation(`/itinerary/${_id}`);
  };

  const isFlatPrice = escapeRoom.pricingType === PricingType.FLAT;

  return (
    <>
      <Row gutter={16}>
        <Col lg={12}>
          {escapeRoom.paymentEnabled ? (
            <>
              <Title level={4}>{t`Payment details`}</Title>
              <CardForm
                onSubmit={withFnLoading(handleSubmit)}
                loading={loading}
              />
            </>
          ) : (
            <div className="flex flex-col">
              <Title level={4}>{t`Reservation info`}</Title>
              <ReservationInfo
                escapeRoom={escapeRoom}
                timeslot={timeslotInfo.timeslot}
                className="mb-4"
              />
              <ContactInfo bookingInfo={bookingInfo} className="mb-4" />
              <Alert
                className="mb-4 lg:mb-0"
                message={t`This is a reservation`}
                description={
                  <Trans>
                    <strong>Payment is made upon arrival.</strong>
                    <br />
                    Escape room operator needs to confirm your reservation.
                  </Trans>
                }
                type="info"
              />
            </div>
          )}
        </Col>
        <Col lg={12}>
          <Title level={4}>{t`Price`}</Title>
          <div className="flex justify-between">
            <span>{t`Participants`}</span>
            <span className="font-bold">{timeslotInfo.participants}</span>
          </div>
          <div className="flex justify-between">
            <span>{isFlatPrice ? t`Group price` : t`Per participant`}</span>
            <span className="font-bold">
              {isFlatPrice
                ? formatCurrency(
                    locale,
                    escapeRoom.currency,
                    timeslotInfo.timeslot.price
                  )
                : formatCurrency(
                    locale,
                    escapeRoom.currency,
                    timeslotInfo.timeslot.price / timeslotInfo.participants
                  )}
            </span>
          </div>
          <Divider>{t`Total`}</Divider>
          <div className="flex justify-end items-center mb-2">
            <Statistic
              className="font-bold text-green-500"
              value={formatCurrency(
                locale,
                escapeRoom.currency,
                timeslotInfo.timeslot.price
              )}
            />
          </div>
          {!escapeRoom.paymentEnabled && (
            <Button
              block
              className="mt-2 mr-4"
              type="primary"
              onClick={() => withLoading(handleSubmit())}
              loading={loading}
            >
              {t`Request reservation`}
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          {escapeRoom.paymentEnabled && (
            <>
              <Divider orientation="left">{t`Reservation info`}</Divider>
              <div className="flex">
                <ReservationInfo
                  escapeRoom={escapeRoom}
                  timeslot={timeslotInfo.timeslot}
                  className="mr-8"
                />
                <ContactInfo bookingInfo={bookingInfo} />
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
