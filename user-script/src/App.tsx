import { hot } from 'react-hot-loader'

import { Layout } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'wouter'
import Booking from './features/Booking/Booking'
import BookingStatus from './features/BookingStatus/BookingStatus'

const ContentContainer = styled(Layout)`
  min-height: 100vh;
  padding: 24px;
`

function App() {
  return (
    <ContentContainer>
      <Switch>
        <Route path="/booking/:organizationId" component={BookingStatus} />
        <Route path="/:organizationId" component={Booking} />
      </Switch>
    </ContentContainer>
  )
}

export default hot(module as any)(App)
