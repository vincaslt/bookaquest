import Text from 'antd/lib/typography/Text'
import * as React from 'react'
import { useI18n } from '~/../commons/utils/i18n'
import { BookingInfo } from '../../../Booking/BookingInfoStep/BookingInfoStep'

interface Props {
  bookingInfo: BookingInfo
  className?: string
}

function ContactInfo({ bookingInfo, className }: Props) {
  const { t } = useI18n()

  return (
    <div className={className}>
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
  )
}

export default ContactInfo
