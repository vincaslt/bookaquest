import * as React from 'react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  newTab?: boolean;
}

export function Link({ newTab, ...rest }: Props) {
  const additionalProps = newTab ? { target: '_blank' } : {};
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a className="text-blue-500" {...additionalProps} {...rest} />;
}
