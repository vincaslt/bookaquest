import * as React from 'react';
import { Icon } from 'antd';
import { classNames } from '@bookaquest/utilities';

interface Props {
  title: string;
  icon: string;
  text: React.ReactNode;
  className?: string;
}

export function IconText({ icon, text, title, className }: Props) {
  return (
    <span title={title} className={classNames(className, 'flex items-center')}>
      <Icon type={icon} className="mr-1" />
      {text}
    </span>
  );
}
