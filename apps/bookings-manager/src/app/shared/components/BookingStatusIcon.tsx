import { Icon } from 'antd';
import { green, blue, red, orange } from '@ant-design/colors';
import * as React from 'react';
import { BookingStatus } from '@bookaquest/interfaces';
import { useI18n } from '@bookaquest/utilities';

interface Props {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusIcon({ status, className }: Props) {
  const { t } = useI18n();

  const icons = {
    [BookingStatus.Accepted]: (
      <Icon
        className={className}
        title={t`Accepted`}
        type="check-circle"
        theme="twoTone"
        twoToneColor={green[3]}
      />
    ),
    [BookingStatus.Pending]: (
      <Icon
        className={className}
        title={t`Pending`}
        type="question-circle"
        theme="twoTone"
        twoToneColor={blue[3]}
      />
    ),
    [BookingStatus.Rejected]: (
      <Icon
        className={className}
        title={t`Rejected`}
        type="close-circle"
        theme="twoTone"
        twoToneColor={red[3]}
      />
    ),
    [BookingStatus.Canceled]: (
      <Icon
        className={className}
        title={t`Canceled`}
        type="minus-circle"
        theme="twoTone"
        twoToneColor={orange[3]}
      />
    )
  };

  return icons[status];
}
