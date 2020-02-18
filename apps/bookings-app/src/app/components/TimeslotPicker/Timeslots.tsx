import { Icon, List } from 'antd';
import { isEqual } from 'date-fns';
import * as React from 'react';
import { Time } from '@bookaquest/components';
import { Timeslot } from '@bookaquest/interfaces';
import { useI18n, classNames, formatCurrency } from '@bookaquest/utilities';

interface Props {
  timeZone: string;
  onSelect: (timeslot: Timeslot) => void;
  timeslot?: Timeslot;
  loading?: boolean;
  timeslots?: Timeslot[];
  currency: string;
}

export function Timeslots({
  loading,
  timeZone,
  onSelect,
  timeslot: selected,
  currency,
  timeslots = []
}: Props) {
  const { t, locale } = useI18n();

  const handleSelect = (timeslot: Timeslot) => () => onSelect(timeslot);

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
            <List.Item
              role="button"
              onClick={handleSelect(timeslot)}
              className={classNames(
                'flex justify-between text-base items-center font-bold',
                selected &&
                  isEqual(selected.start, timeslot.start) &&
                  isEqual(selected.end, timeslot.end) &&
                  'bg-yellow-100'
              )}
            >
              <span className="flex items-center">
                <Icon type="clock-circle" className="mr-2" />
                <Time
                  date={[timeslot.start, timeslot.end]}
                  timeZone={timeZone}
                />
              </span>
              <span className="flex">
                {formatCurrency(locale, currency, timeslot.price)}
              </span>
            </List.Item>
          )}
        />
      </td>
    </tr>
  );
}
