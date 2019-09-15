import { Layout } from 'antd'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import { Route, Switch } from 'wouter'
import Booking from './features/Booking/Booking'
import BookingStatus from './features/BookingStatus/BookingStatus'

const ContentContainer = styled(Layout)`
  min-height: 100vh;
  padding: 24px;
`

const Footer = styled(Layout.Footer)`
  text-align: center;
  color: rgba(0, 0, 0, 0.45);

  & > a {
    color: rgba(0, 0, 0, 0.65);

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`

// TODO: footer link
function App() {
  return (
    <ContentContainer>
      <Switch>
        <Route path="/booking/:organizationId" component={BookingStatus} />
        <Route path="/:organizationId" component={Booking} />
      </Switch>
      <Footer>
        Powered by <a href="#">BookaQuest</a>
      </Footer>
    </ContentContainer>
  )
}

export default hot(module as any)(App)
