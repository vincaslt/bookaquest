import * as React from 'react'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  newTab?: boolean
}

function Link({ newTab, ...rest }: Props) {
  const additionalProps = newTab ? { target: '_blank' } : {}
  return <a className="text-blue-500" {...additionalProps} {...rest} />
}

export default Link
