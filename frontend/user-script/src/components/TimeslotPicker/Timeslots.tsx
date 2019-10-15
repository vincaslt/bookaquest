import { Button, Icon, List } from 'antd'
import { format } from 'date-fns'
import * as React from 'react'
import { Timeslot } from '~/../commons/interfaces/timeslot'
import { useI18n } from '~/../commons/utils/i18n'

interface Props {
  onSelect: (timeslot: Timeslot) => void
  loading?: boolean
  timeslots?: Timeslot[]
}

function Timeslots({ loading, onSelect, timeslots = [] }: Props) {
  const { t, dateFnsLocale } = useI18n()

  const handleSelect = (timeslot: Timeslot) => () => onSelect(timeslot)

  return (
    <tr>
      <td colSpan={7} className="border border-t-0 bg-gray-300 p-4">
        <List
          className="bg-white"
          bordered
          loading={loading}
          dataSource={timeslots}
          locale={{ emptyText: t`No timeslots available for this day` }}
          renderItem={timeslot => (
            <List.Item className="flex justify-between">
              <div className="flex text-base items-center font-bold">
                <Icon type="clock-circle" className="mr-2" />
                {format(timeslot.start, 'p', { locale: dateFnsLocale })}
                {' - '}
                {format(timeslot.end, 'p', { locale: dateFnsLocale })}
              </div>

              <Button
                key="book"
                type="primary"
                onClick={handleSelect(timeslot)}
              >{t`Book Now`}</Button>
            </List.Item>
          )}
        />
      </td>
    </tr>
  )
}

export default Timeslots
