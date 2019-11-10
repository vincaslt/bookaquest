import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  min-height: 35px;
`

interface Props {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
}

function DetailsItem({ children, label, className = 'items-center' }: Props) {
  return (
    <Container className={className}>
      <span className="font-medium mr-4">{label}</span>
      {children}
    </Container>
  )
}

export default DetailsItem
