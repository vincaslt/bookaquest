import { Alert, Button, Divider, notification, Statistic, Typography } from 'antd'
import { CreateBooking } from 'commons/interfaces/booking'
import * as React from 'react'
import { injectStripe, ReactStripeElements } from 'react-stripe-elements'
import styled from 'styled-components'
import { useLocation } from 'wouter'
import useLoading from '~/../commons/hooks/useLoading'
import { EscapeRoom, PricingType } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../../api/application'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'
import ContactInfo from './Details/ContactInfo'
import ReservationInfo from './Details/ReservationInfo'
import CardForm from './StripeCardForm/CardForm'

const { Title } = Typography

const BookingPriceContainer = styled.div`
  min-width: 256px;
`

interface Props extends ReactStripeElements.InjectedStripeProps {
  escapeRoom: EscapeRoom
  bookingInfo: BookingInfo
  timeslot: Timeslot
}

function ConfirmationStep({ bookingInfo, escapeRoom, timeslot, stripe }: Props) {
  const { t } = useI18n()
  const [, setLocation] = useLocation()
  const [paymentLoading, , withFnLoading] = useLoading()

  const handleSubmit = async (paymentInfo?: { name: string }) => {
    const options: CreateBooking = {
      ...bookingInfo,
      startDate: timeslot.start,
      endDate: timeslot.end,
      escapeRoomId: escapeRoom.id
    }

    if (stripe && escapeRoom.paymentEnabled && paymentInfo) {
      const { token } = await stripe.createToken({ name: paymentInfo.name })

      if (!token) {
        notification.open({
          message: t`Error`,
          type: 'error',
          description: t`This card cannot be used, try a different one`
        })
        return
      }
      options.paymentToken = token.id
    }

    const { id } = await api.createBooking(options)
    setLocation(`/booking/${id}`)
  }

  const isFlatPrice = escapeRoom.pricingType === PricingType.FLAT

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div className="mr-4 flex-1">
          {escapeRoom.paymentEnabled ? (
            <>
              <Title level={4}>{t`Payment details`}</Title>
              <CardForm onSubmit={withFnLoading(handleSubmit)} loading={paymentLoading} />
            </>
          ) : (
            <div className="flex flex-col">
              <Title level={4}>{t`Reservation info`}</Title>
              <ReservationInfo escapeRoom={escapeRoom} timeslot={timeslot} className="mb-4" />
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
              value={isFlatPrice ? escapeRoom.price : escapeRoom.price * bookingInfo.participants}
              suffix="$"
            />
          </div>

          {!escapeRoom.paymentEnabled && (
            <Button block className="mt-2 mr-4" type="primary" onClick={() => handleSubmit()}>
              {t`Request reservation`}
            </Button>
          )}
        </BookingPriceContainer>
      </div>
      {escapeRoom.paymentEnabled && (
        <>
          <Divider orientation="left">{t`Booking info`}</Divider>
          <div className="flex">
            <ReservationInfo escapeRoom={escapeRoom} timeslot={timeslot} className="mr-8" />
            <ContactInfo bookingInfo={bookingInfo} />
          </div>
        </>
      )}
    </div>
  )
}

export default injectStripe(ConfirmationStep)
