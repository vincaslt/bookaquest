import { Layout } from 'antd'
import { BasicProps } from 'antd/lib/layout/layout'
import * as React from 'react'
import styled from 'styled-components'

interface Props extends BasicProps {
  noBackground?: boolean
}

const Wrapper = ({ noBackground, ...rest }: Props) => <Layout.Content {...rest} />

const PageContent = styled(Wrapper)`
  margin: 24px;
  flex: 1;
  ${({ noBackground }: Props) => (noBackground ? '' : 'padding: 24px')};
  ${({ noBackground }: Props) => (noBackground ? '' : 'background-color: white')};
`

export default PageContent
