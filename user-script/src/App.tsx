import { Layout } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import Booking from './features/Booking/Booking'

const ContentContainer = styled(Layout)`
  min-height: 100vh;
  padding: 24px;
`
enum Routes {
  Booking = 'booking'
}

function App() {
  const urlParts = window.location.pathname.split('/')
  const route = urlParts[1]
  const organizationId = urlParts[2]

  return (
    <ContentContainer>
      {route === Routes.Booking && <Booking organizationId={organizationId} />}
    </ContentContainer>
  )
}

export default App
