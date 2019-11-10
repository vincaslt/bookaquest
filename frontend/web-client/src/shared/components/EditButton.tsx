import { Icon } from 'antd'
import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: 0px;
  background: transparent;
  padding-bottom: 4px;
  line-height: inherit;
  display: inline-flex;
`

interface Props {
  onClick: () => void
}

function EditButton({ onClick }: Props) {
  return (
    <Container role="button" className="ant-typography-edit" aria-label="Edit" onClick={onClick}>
      <Icon type="edit" />
    </Container>
  )
}

export default EditButton
