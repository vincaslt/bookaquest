import { format, set } from 'date-fns'
import prop from 'ramda/es/prop'
import sortBy from 'ramda/es/sortBy'
import * as React from 'react'
import { BusinessHours } from '../interfaces/businessHours'
import { useI18n } from '../utils/i18n'

interface Props {
  businessHours?: BusinessHours[]
}

const sortByWeekday = sortBy(prop('weekday'))
const toTime = (hours: number) => {
  // TODO: use locale setting for format 24h or 12h
  const time = set(new Date(), { hours: Math.floor(hours), minutes: (hours % 1) * 60 })
  return format(time, 'HH:mm')
}

function WorkHours({ businessHours = [] }: Props) {
  const { t } = useI18n()

  const weekdays = [
    t`Monday`,
    t`Tuesday`,
    t`Wednesday`,
    t`Thursday`,
    t`Friday`,
    t`Saturday`,
    t`Sunday`
  ]
  return (
    <div>
      {businessHours.length ? (
        sortByWeekday(businessHours).map(({ hours, weekday }) => (
          <div className="mb-1" key={weekday}>
            <span className="font-medium mr-2">{weekdays[weekday - 1]}</span>
            <span>
              {toTime(hours[0])} - {toTime(hours[1])}
            </span>
          </div>
        ))
      ) : (
        <>{t`No business hours set`}</>
      )}
    </div>
  )
}

export default WorkHours
