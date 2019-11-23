import { Tooltip } from 'antd';
import { getMonth, isBefore, isSameDay, startOfDay, format } from 'date-fns';
import AspectRatio from 'react-aspect-ratio';
import { red } from '@ant-design/colors';
import { useI18n, classNames } from '@bookaquest/utilities';
import * as React from 'react';
import styled, { css } from 'styled-components';

interface DayButtonProps {
  selected?: boolean;
}

const DayButton = styled.button<DayButtonProps>`
  &:disabled {
    cursor: not-allowed;
  }

  &:not(:disabled) span {
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    background-color: ${({ selected }) => selected && '#fff'};
  }

  ${({ selected }) =>
    !selected &&
    css`
      &:not(:disabled):hover span {
        background-color: ${red[6]};
        color: white;
      }
    `}
`;

interface Props {
  date: Date;
  currentMonth: number;
  timeslotCount: number;
  selected?: boolean;
  onSelect: (date: Date) => void;
}

export function Day({
  date,
  currentMonth,
  onSelect,
  timeslotCount,
  selected = false
}: Props) {
  const now = new Date();
  const { t, dateFnsLocale } = useI18n();

  const isDisabled = isBefore(date, startOfDay(now));

  const selectedClass = selected ? 'bg-gray-300 border-b-0' : '';
  const emptyClass = timeslotCount === 0 ? 'text-gray-300' : 'text-gray-600';
  const notCurrentMonthClass =
    getMonth(date) !== currentMonth ? 'bg-gray-100' : emptyClass;
  const disabledClass = isDisabled
    ? 'bg-gray-100 text-gray-300'
    : notCurrentMonthClass;

  const todayClass = isSameDay(date, now) ? 'border-2 border-red-600' : '';

  const handleClick = () => onSelect(date);

  const button = (
    <DayButton
      onClick={handleClick}
      disabled={isDisabled}
      selected={selected}
      className={`flex items-center justify-center text-xl w-full`}
    >
      <span
        className={`p-2 flex items-center justify-center rounded-full w-10 h-10 ${todayClass}`}
      >
        {format(date, 'd', { locale: dateFnsLocale })}
      </span>
    </DayButton>
  );

  return (
    <td
      className={classNames('border', selectedClass, disabledClass, emptyClass)}
    >
      <AspectRatio ratio={1}>
        {isDisabled ? (
          button
        ) : (
          <Tooltip
            title={
              timeslotCount ? t`${timeslotCount} available` : t`None available`
            }
            mouseLeaveDelay={0}
            placement="top"
          >
            {button}
          </Tooltip>
        )}
      </AspectRatio>
    </td>
  );
}
