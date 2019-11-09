import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  min-height: 35px;
  align-items: center;
`

interface Props {
  label: React.ReactNode
  children: React.ReactNode
}

function DetailsItem({ children, label }: Props) {
  return (
    <Container>
      <span className="font-medium mr-4">{label}</span>
      {children}
    </Container>
  )
}

export default DetailsItem
