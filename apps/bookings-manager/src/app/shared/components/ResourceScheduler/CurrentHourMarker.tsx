import * as React from 'react';
import { differenceInMinutes, startOfHour } from 'date-fns';

interface Props {
  columnWidth: number;
  rowHeight: number;
}

// TODO: force rerender every minute
export function CurrentHourMarker({ columnWidth, rowHeight }: Props) {
  const now = new Date();
  const left = (differenceInMinutes(now, startOfHour(now)) * columnWidth) / 60;
  return (
    <div
      style={{ left, top: 0, width: 2, height: rowHeight }}
      className="absolute bg-red-300 z-20"
    ></div>
  );
}
