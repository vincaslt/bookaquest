import Text from 'antd/lib/typography/Text'
import * as React from 'react'
import Time from '~/../commons/components/Time'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'

interface Props {
  timeslot: Timeslot
  escapeRoom: EscapeRoom
  className?: string
}

function ReservationInfo({ timeslot, escapeRoom, className }: Props) {
  const { t } = useI18n()

  return (
    <div className={className}>
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
  )
}

export default ReservationInfo
