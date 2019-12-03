import { differenceInMinutes } from 'date-fns/esm';
import { startOfHour } from 'date-fns';
import Text from 'antd/lib/typography/Text';
import { Badge } from 'antd';
import * as React from 'react';
import { Time } from '@bookaquest/components';
import { classNames } from '@bookaquest/utilities';

interface Props {
  columnWidth: number;
  rowHeight: number;
  name: string;
  time: [Date, Date];
  onClick: () => void;
  tooltip: string;
  className: string;
  overlappingCount: number;
}

export function ResourceEvent({
  tooltip,
  time: [start, end],
  name,
  onClick,
  columnWidth,
  rowHeight,
  className,
  overlappingCount
}: Props) {
  const width = (differenceInMinutes(end, start) * columnWidth) / 60;
  const left =
    (differenceInMinutes(start, startOfHour(start)) * columnWidth) / 60;

  return (
    <div
      title={tooltip}
      style={{
        width: width - 5,
        left: left + 2,
        top: 2,
        height: rowHeight - 5
      }}
      className={classNames(
        'p-1 absolute rounded-sm z-10 hover:shadow-md cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Badge
        count={overlappingCount}
        overflowCount={100}
        className="max-w-full"
        offset={[3, -3]}
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: 'white' }}
      >
        <div>
          <Text className="max-w-full" strong ellipsis>
            {name}
          </Text>
        </div>
        <div>
          <Text className="max-w-full" ellipsis>
            <Time date={[start, end]} />
          </Text>
        </div>
      </Badge>
    </div>
  );
}
