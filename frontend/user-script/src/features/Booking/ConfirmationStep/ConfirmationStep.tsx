import { Button, Divider, Icon, Statistic, Typography } from 'antd'
import { format } from 'date-fns'
import * as React from 'react'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'
import { BookingInfo } from '../BookingInfoStep/BookingInfoStep'

const { Title } = Typography

interface Props {
  escapeRoom: EscapeRoom
  bookingInfo: BookingInfo
  timeslot: Timeslot
  onSubmit: () => void
}

function ConfirmationStep({ bookingInfo, escapeRoom, timeslot, onSubmit }: Props) {
  const { t, dateFnsLocale } = useI18n()

  const participants = 4

  return (
    <>
      <div className="flex justify-between">
        <div className="mr-4">
          <div className="mb-6">
            <Title level={4}>{t`Booking info`}</Title>
            <div>
              <span className="font-semibold mr-2">{t`Escape room:`}</span>
              {escapeRoom.name}
            </div>
            <div>
              <span className="font-semibold mr-2">{t`Date:`}</span>
              {format(timeslot.start, 'PPP', { locale: dateFnsLocale })}
            </div>
            <div>
              <span className="font-semibold mr-2">{t`Time:`}</span>
              {format(timeslot.start, 'p', { locale: dateFnsLocale })}
              {' - '}
              {format(timeslot.end, 'p', { locale: dateFnsLocale })}
            </div>
          </div>
          <div>
            <Title level={4}>{t`Contact info`}</Title>
            <div>
              <span className="font-semibold mr-2">{t`Name:`}</span>
              {bookingInfo.name}
            </div>
            <div>
              <span className="font-semibold mr-2">{t`Email:`}</span>
              {bookingInfo.email}
            </div>
            <div>
              <span className="font-semibold mr-2">{t`Phone:`}</span>
              {bookingInfo.phoneNumber}
            </div>
          </div>
        </div>
        <div className="border p-4 w-2/5">
          <Title level={4}>{t`Price`}</Title>
          <div className="flex justify-between">
            <span>{t`Participants`}</span>
            <span className="font-bold">{participants}</span>
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
              value={escapeRoom.price * participants}
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
