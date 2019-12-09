import { Icon } from 'antd';
import { getDay } from 'date-fns';
import * as React from 'react';
import styled from 'styled-components';
import { Time } from '@bookaquest/components';
import { listWeekdays, useI18n } from '@bookaquest/utilities';

const DayHeading = styled.th`
  width: calc(100% / 7);
`;

interface Props {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function Header({ month, onPrev, onNext }: Props) {
  const { dateFnsLocale } = useI18n();

  return (
    <thead className="bg-red-600 text-white">
      <tr className="text-center">
        <th colSpan={7} className="border border-red-600">
          <div className="flex flex-1 justify-between">
            <button
              className="w-16 items-center justify-center flex"
              onClick={onPrev}
            >
              <Icon type="arrow-left" />
            </button>
            <span className="p-2">
              <Time date={month} type="date" />
            </span>
            <button
              className="w-16 items-center justify-center flex"
              onClick={onNext}
            >
              <Icon type="arrow-right" />
            </button>
          </div>
        </th>
      </tr>
      <tr>
        {listWeekdays(dateFnsLocale).map(weekday => (
          <DayHeading
            className="p-2 text-center border border-red-600"
            key={getDay(weekday)}
          >
            <Time date={weekday} type={{ format: 'ccc' }} />
          </DayHeading>
        ))}
      </tr>
    </thead>
  );
}
