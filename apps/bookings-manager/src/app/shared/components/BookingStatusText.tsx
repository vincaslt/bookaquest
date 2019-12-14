import * as React from 'react';
import { BookingStatus } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';

interface Props {
  status: BookingStatus;
}

export function BookingStatusText({ status }: Props) {
  const { t } = useI18n();

  const text = {
    [BookingStatus.Accepted]: t`Accepted`,
    [BookingStatus.Pending]: t`Pending`,
    [BookingStatus.Rejected]: t`Rejected`,
    [BookingStatus.Canceled]: t`Canceled`
  }[status];

  return <>{text}</>;
}
