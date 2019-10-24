import { Alert, Button, Divider, notification, Statistic, Typography } from 'antd'
import { CreateBooking } from 'commons/interfaces/booking'
import * as React from 'react'
import { injectStripe, ReactStripeElements } from 'react-stripe-elements'
import styled from 'styled-components'
import { useLocation } from 'wouter'
import Time from '~/../commons/components/Time'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../../api/application'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'
import CardForm from './StripeCardForm/CardForm'

const { Title, Text } = Typography

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

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div className="mr-4 flex-1">
          {escapeRoom.paymentEnabled ? (
            <>
              <Title level={4}>{t`Payment details`}</Title>
              <CardForm onSubmit={handleSubmit} />
            </>
          ) : (
            <Alert
              message={t`This is only a reservation`}
              description={t`Escape room operator will need to confirm it after it's requested`}
              type="info"
            />
          )}
        </div>
        <BookingPriceContainer className="pl-4 w-2/5">
          <Title level={4}>{t`Price`}</Title>
          <div className="flex justify-between">
            <span>{t`Participants`}</span>
            <span className="font-bold">{bookingInfo.participants}</span>
          </div>
          <div className="flex justify-between">
            <span>{t`Per participant`}</span>
            <span className="font-bold">${escapeRoom.price}</span>
          </div>
          <Divider>{t`Total`}</Divider>
          <div className="flex justify-between items-center mb-2">
            <Button type="link" className="p-0">{t`Apply a discount`}</Button>
            <Statistic
              className="font-bold text-green-500"
              value={escapeRoom.price * bookingInfo.participants}
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
      <Divider orientation="left">{t`Booking info`}</Divider>
      <div className="flex">
        <div className="mr-8">
          <div>
            <Text strong className="mr-2">{t`Escape room:`}</Text>
            {escapeRoom.name}
          </div>
          <div>
            <Text strong className="mr-2">{t`Date:`}</Text>
            <Time date={timeslot.start} type="date" />
          </div>
          <div>
            <Text strong className="mr-2">{t`Time:`}</Text>
            <Time date={[timeslot.start, timeslot.end]} />
          </div>
        </div>
        <div>
          <div>
            <Text strong className="mr-2">{t`Name:`}</Text>
            {bookingInfo.name}
          </div>
          <div>
            <Text strong className="mr-2">{t`Email:`}</Text>
            {bookingInfo.email}
          </div>
          <div>
            <Text strong className="mr-2">{t`Phone:`}</Text>
            {bookingInfo.phoneNumber}
          </div>
        </div>
      </div>
    </div>
  )
}

export default injectStripe(ConfirmationStep)
