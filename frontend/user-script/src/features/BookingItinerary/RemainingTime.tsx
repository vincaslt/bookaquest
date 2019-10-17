import { Typography } from 'antd'
import * as React from 'react'
import Countdown from 'react-countdown-now'
import { useI18n } from '~/../commons/utils/i18n'

const { Text } = Typography

interface Props {
  date: Date
}

function RemainingTime({ date }: Props) {
  const { t } = useI18n()

  return (
    <div className="flex items-center flex-col mb-8">
      <Countdown
        date={date}
        renderer={({ days, hours, minutes, seconds }) => (
          <div className="flex">
            <div className="flex flex-col mr-6">
              <Text className="font-semibold text-5xl">{days}</Text>
              <Text strong className="text-base">{t`DAYS`}</Text>
            </div>
            <div className="flex flex-col mr-6">
              <Text className="font-semibold text-5xl">{hours}</Text>
              <Text strong className="text-base">{t`HOURS`}</Text>
            </div>
            <div className="flex flex-col mr-6">
              <Text className="font-semibold text-5xl">{minutes}</Text>
              <Text strong className="text-base">{t`MINUTES`}</Text>
            </div>
            <div className="flex flex-col">
              <Text className="font-semibold text-5xl">{seconds}</Text>
              <Text strong className="text-base">{t`SECONDS`}</Text>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default RemainingTime
