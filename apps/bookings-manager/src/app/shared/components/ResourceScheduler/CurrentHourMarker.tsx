import { differenceInMinutes, startOfHour } from 'date-fns';
import * as React from 'react';

interface Props {
  columnWidth: number;
  rowHeight: number;
  currentHour: Date;
}

export function CurrentHourMarker({
  columnWidth,
  rowHeight,
  currentHour
}: Props) {
  const left =
    (differenceInMinutes(currentHour, startOfHour(currentHour)) * columnWidth) /
    60;
  return (
    <div
      style={{ left, top: 0, width: 2, height: rowHeight }}
      className="absolute bg-red-300 z-20"
    ></div>
  );
}
