import * as React from 'react';
import { times } from 'ramda';
import { Icon } from 'antd';
import { classNames } from '@bookaquest/utilities';

interface Props {
  difficulty: number;
  className?: string;
  max?: number;
}

export function DifficultyIndicator({ difficulty, className, max = 5 }: Props) {
  return (
    <div className={classNames(className, 'flex items-center')}>
      {times(
        i => (
          <Icon key={i} type="lock" theme="filled" />
        ),
        difficulty
      )}
      {times(
        i => (
          <Icon key={i} type="lock" />
        ),
        max - difficulty
      )}
    </div>
  );
}
