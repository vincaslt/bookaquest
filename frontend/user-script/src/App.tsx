import { Layout, Spin } from 'antd'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { StripeProvider } from 'react-stripe-elements'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { Route, Switch } from 'wouter'
import { useI18n } from '~/../commons/utils/i18n'
import Booking from './features/Booking/Booking'
import BookingItinerary from './features/BookingItinerary/BookingItinerary'

const AppSpinnerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`

const GlobalStyle = createGlobalStyle`
  .ant-steps-item-custom .ant-steps-item-icon > .ant-steps-icon {
    width: auto;
    display: flex;
    align-items: center;
  }
`

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
// TODO: load stripe keys from api (DB)
function App() {
  const { ready } = useI18n(undefined, { useSuspense: false })

  if (!ready) {
    return (
      <AppSpinnerContainer>
        <Spin size="large" />
      </AppSpinnerContainer>
    )
  }
  return (
    <ContentContainer>
      <GlobalStyle />
      <StripeProvider apiKey="pk_test_RBJXD9Q0peOpWei9vzqLBjUl001D6kkTMW">
        <Switch>
          <Route path="/booking/:organizationId" component={BookingItinerary} />
          <Route path="/:organizationId" component={Booking} />
        </Switch>
      </StripeProvider>
      <Footer>
        Powered by <a href="#">BookaQuest</a>
      </Footer>
    </ContentContainer>
  )
}

export default hot(module as any)(App)
