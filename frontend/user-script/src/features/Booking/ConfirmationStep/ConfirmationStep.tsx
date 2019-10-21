import { Button, Divider, Statistic, Typography } from 'antd'
import * as React from 'react'
import Time from '~/../commons/components/Time'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'

const { Title, Text } = Typography

interface Props {
  escapeRoom: EscapeRoom
  bookingInfo: BookingInfo
  timeslot: Timeslot
  onSubmit: () => void
}

function ConfirmationStep({ bookingInfo, escapeRoom, timeslot, onSubmit }: Props) {
  const { t } = useI18n()

  return (
    <>
      <div className="flex justify-between">
        <div className="mr-4">
          <div className="mb-6">
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
          <div>
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
        </div>
        <div className="border p-4 w-2/5">
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
          <div className="flex justify-between items-center mb-4">
            <Button type="link" className="p-0">{t`Apply a discount`}</Button>
            <Statistic
              className="font-bold text-green-500"
              value={escapeRoom.price * bookingInfo.participants}
              suffix="$"
            />
          </div>

          <Button block type="primary" onClick={onSubmit}>
            {t`Request booking`}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ConfirmationStep
