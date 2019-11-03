import { Layout } from 'antd'
import { BasicProps } from 'antd/lib/layout/layout'
import * as React from 'react'
import styled from 'styled-components'
import PageContentLoading from '../components/PageContentLoading'

interface Props extends BasicProps {
  noBackground?: boolean
  loading?: boolean
}

const Wrapper = ({ noBackground, loading, ...rest }: Props) =>
  loading ? <PageContentLoading {...rest} /> : <Layout.Content {...rest} />

const PageContent = styled(Wrapper)`
  margin: 24px;
  flex: 1;
  ${({ noBackground }: Props) => (noBackground ? '' : 'padding: 24px')};
  ${({ noBackground }: Props) => (noBackground ? '' : 'background-color: white')};
`

export default PageContent
