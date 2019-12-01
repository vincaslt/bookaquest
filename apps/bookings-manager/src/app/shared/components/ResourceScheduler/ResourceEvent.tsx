import * as React from 'react';
import { differenceInMinutes } from 'date-fns/esm';
import { startOfHour } from 'date-fns';

interface Props {
  columnWidth: number;
  rowHeight: number;
  name: string;
  time: Interval;
}

export function ResourceEvent({ time, name, columnWidth, rowHeight }: Props) {
  const width = (differenceInMinutes(time.end, time.start) * columnWidth) / 60;
  const left =
    (differenceInMinutes(time.start, startOfHour(time.start)) * columnWidth) /
    60;

  return (
    <div
      style={{
        width: width - 5,
        left: left + 2,
        top: 2,
        height: rowHeight - 5
      }}
      className="p-1 bg-green-400 absolute rounded-sm z-10"
    >
      {name}
    </div>
  );
}
