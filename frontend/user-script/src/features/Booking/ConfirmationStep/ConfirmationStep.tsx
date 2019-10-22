import { Button, Divider, Statistic, Typography } from 'antd'
import * as React from 'react'
import { CardElement, injectStripe, ReactStripeElements } from 'react-stripe-elements'
import { useLocation } from 'wouter'
import Time from '~/../commons/components/Time'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../../api/application'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'
import CardForm from './CardForm'

const { Title, Text } = Typography

interface Props extends ReactStripeElements.InjectedStripeProps {
  escapeRoom: EscapeRoom
  bookingInfo: BookingInfo
  timeslot: Timeslot
}

function ConfirmationStep({ bookingInfo, escapeRoom, timeslot, stripe }: Props) {
  const { t } = useI18n()
  const [, setLocation] = useLocation()

  if (!stripe) {
    return null
  }

  const handleSubmit = async () => {
    const { token } = await stripe.createToken({ name: 'Name' })

    if (!token) {
      console.error('Invalid token') // TODO: generic payment error, but log this
      return
    }

    const { id } = await api.createBooking({
      ...bookingInfo,
      startDate: timeslot.start,
      endDate: timeslot.end,
      escapeRoomId: escapeRoom.id,
      paymentToken: token.id
    })
    setLocation(`/booking/${id}`)
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="mr-4">
          <div>
            <Title level={4}>{t`Booking info`}</Title>
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
          <div className="mt-6">
            <Title level={4}>{t`Contact info`}</Title>
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
          <div className="mt-6">
            <Title level={4}>{t`Payment info`}</Title>
            <CardForm />
            <Button className="mt-2" type="primary" onClick={handleSubmit}>
              {t`Pay`}
            </Button>
          </div>
        </div>
        <div className="w-2/5">
          <div className="border p-4">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default injectStripe(ConfirmationStep)
