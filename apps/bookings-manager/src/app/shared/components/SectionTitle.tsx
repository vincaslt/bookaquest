import * as React from 'react';

interface Props {
  children: string;
  extra?: React.ReactNode;
}

export function SectionTitle({ children, extra }: Props) {
  return (
    <div className="flex justify-between">
      <h2 className="ant-descriptions-title">{children}</h2>
      <div>{extra}</div>
    </div>
  );
}
