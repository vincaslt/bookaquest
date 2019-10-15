import { Icon } from 'antd'
import { format, setDay } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'

const DayHeading = styled.th`
  width: calc(100% / 7);
`

interface Props {
  month: Date
  onPrev: () => void
  onNext: () => void
}

const Header = ({ month, onPrev, onNext }: Props) => {
  const { dateFnsLocale } = useI18n()
  const currentMonth = format(month, 'PPP', { locale: dateFnsLocale })

  return (
    <thead className="bg-red-500 text-white">
      <tr className="text-center">
        <th colSpan={7}>
          <div className="flex flex-1 justify-between">
            <button className="w-16 items-center justify-center flex" onClick={onPrev}>
              <Icon type="arrow-left" />
            </button>
            <span className="p-2">{currentMonth}</span>
            <button className="w-16 items-center justify-center flex" onClick={onNext}>
              <Icon type="arrow-right" />
            </button>
          </div>
        </th>
      </tr>
      <tr>
        {[1, 2, 3, 4, 5, 6, 0].map(weekday => (
          <DayHeading className="p-2 text-center" key={weekday}>
            {format(setDay(new Date(), weekday), 'ccc', { locale: dateFnsLocale })}
          </DayHeading>
        ))}
      </tr>
    </thead>
  )
}

export default Header
