import { Alert, Button, Divider, Statistic, Typography } from 'antd';
import { useLocation } from 'wouter';
import * as React from 'react';
import styled from 'styled-components';
import {
  EscapeRoom,
  Timeslot,
  CreateBooking,
  PricingType
} from '@bookaquest/interfaces';
import { useI18n, useLoading } from '@bookaquest/utilities';
import * as api from '../../../api/application';
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep';
import { ContactInfo } from './Details/ContactInfo';
import { ReservationInfo } from './Details/ReservationInfo';
import { CardForm } from './StripeCardForm/CardForm';

const { Title } = Typography;

const BookingPriceContainer = styled.div`
  min-width: 256px;
`;

interface Props {
  escapeRoom: EscapeRoom;
  bookingInfo: BookingInfo;
  timeslot: Timeslot;
}

export function ConfirmationStep({ bookingInfo, escapeRoom, timeslot }: Props) {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [loading, withLoading, withFnLoading] = useLoading();

  const handleSubmit = async (token?: stripe.Token) => {
    const options: CreateBooking = {
      ...bookingInfo,
      startDate: timeslot.start,
      endDate: timeslot.end,
      escapeRoomId: escapeRoom._id
    };

    if (token && escapeRoom.paymentEnabled) {
      options.paymentToken = token.id;
    }

    const { _id } = await api.createBooking(options);
    setLocation(`/itinerary/${_id}`);
  };

  const isFlatPrice = escapeRoom.pricingType === PricingType.FLAT;

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div className="mr-4 flex-1">
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
                timeslot={timeslot}
                className="mb-4"
              />
              <ContactInfo bookingInfo={bookingInfo} className="mb-4" />
              <Alert
                message={t`This is a reservation`}
                description={t`Escape room operator will need to confirm your reservation. Payment will be done upon arrival.`}
                type="info"
              />
            </div>
          )}
        </div>
        <BookingPriceContainer className="pl-4 w-2/5">
          <Title level={4}>{t`Price`}</Title>
          <div className="flex justify-between">
            <span>{t`Participants`}</span>
            <span className="font-bold">{bookingInfo.participants}</span>
          </div>
          <div className="flex justify-between">
            <span>{isFlatPrice ? t`Group price` : t`Per participant`}</span>
            <span className="font-bold">${escapeRoom.price}</span>
          </div>
          <Divider>{t`Total`}</Divider>
          <div className="flex justify-between items-center mb-2">
            <Button type="link" className="p-0">{t`Apply a discount`}</Button>
            <Statistic
              className="font-bold text-green-500"
              value={
                isFlatPrice
                  ? escapeRoom.price
                  : escapeRoom.price * bookingInfo.participants
              }
              suffix="$" // TODO: dynamic currency
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
        </BookingPriceContainer>
      </div>
      {escapeRoom.paymentEnabled && (
        <>
          <Divider orientation="left">{t`Booking info`}</Divider>
          <div className="flex">
            <ReservationInfo
              escapeRoom={escapeRoom}
              timeslot={timeslot}
              className="mr-8"
            />
            <ContactInfo bookingInfo={bookingInfo} />
          </div>
        </>
      )}
    </div>
  );
}
