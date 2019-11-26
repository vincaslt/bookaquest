import * as React from 'react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  newTab?: boolean;
  className?: string;
}

export function Link({ newTab, className = 'text-blue-500', ...rest }: Props) {
  const additionalProps = newTab ? { target: '_blank' } : {};
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a className={className} {...additionalProps} {...rest} />;
}
