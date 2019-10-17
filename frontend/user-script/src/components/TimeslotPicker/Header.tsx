import { Icon } from 'antd'
import { setDay } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components'
import Time from '~/../commons/components/Time'

const DayHeading = styled.th`
  width: calc(100% / 7);
`

interface Props {
  month: Date
  onPrev: () => void
  onNext: () => void
}

const Header = ({ month, onPrev, onNext }: Props) => {
  return (
    <thead className="bg-red-500 text-white">
      <tr className="text-center">
        <th colSpan={7}>
          <div className="flex flex-1 justify-between">
            <button className="w-16 items-center justify-center flex" onClick={onPrev}>
              <Icon type="arrow-left" />
            </button>
            <span className="p-2">
              <Time date={month} type="date" />
            </span>
            <button className="w-16 items-center justify-center flex" onClick={onNext}>
              <Icon type="arrow-right" />
            </button>
          </div>
        </th>
      </tr>
      <tr>
        {[1, 2, 3, 4, 5, 6, 0].map(weekday => (
          <DayHeading className="p-2 text-center" key={weekday}>
            <Time date={setDay(new Date(), weekday)} type={{ format: 'ccc' }} />
          </DayHeading>
        ))}
      </tr>
    </thead>
  )
}

export default Header
