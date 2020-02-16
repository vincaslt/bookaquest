import { Icon } from 'antd';
import * as React from 'react';
import { classNames } from '@bookaquest/utilities';

interface Props {
  title: string;
  icon: string;
  text: React.ReactNode;
  className?: string;
}

export function IconText({ icon, text, title, className }: Props) {
  return (
    <span
      title={title}
      className={classNames(className, 'flex items-center mr-2')}
    >
      <Icon type={icon} className="mr-1" />
      {text}
    </span>
  );
}
