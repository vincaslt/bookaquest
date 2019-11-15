import * as React from 'react';

interface Props {
  children: string;
  extra?: React.ReactNode;
}

export function SectionTitle({ children, extra }: Props) {
  return (
    <div className="flex justify-between">
      <div className="ant-descriptions-title">{children}</div>
      <div>{extra}</div>
    </div>
  );
}
