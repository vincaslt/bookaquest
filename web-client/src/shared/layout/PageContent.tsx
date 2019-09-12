import { Layout } from 'antd'
import styled from 'styled-components'

interface Props {
  noBackground?: boolean
}

const PageContent = styled(Layout.Content)`
  margin: 24px;
  flex: 1;
  ${({ noBackground }: Props) => (noBackground ? '' : 'padding: 24px')};
  ${({ noBackground }: Props) => (noBackground ? '' : 'background-color: white')};
`

export default PageContent
