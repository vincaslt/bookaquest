import { Router } from '@reach/router'
import { Layout, Spin } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Routes from './constants/routes'
import BookingsPage from './pages/BookingsPage/BookingsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import OrganizationPage from './pages/OrganizationPage/OrganizationPage'
import RegistrationPage from './pages/RegistrationPage/RegistrationPage'
import { useUser, withUserProvider } from './shared/providers/UserProvider'
import SideMenu from './shared/SideMenu'
import './utils/i18n'

const AppSpinnerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`

const ContentContainer = styled(Layout)`
  margin-left: 256px;
  min-height: 100vh;
  padding: 24px 16px 0;
`

function App() {
  const { isLoading } = useUser()
  const { ready } = useTranslation(undefined, { useSuspense: false })

  if (isLoading || !ready) {
    return (
      <AppSpinnerContainer>
        <Spin size="large" />
      </AppSpinnerContainer>
    )
  }

  // TODO: only render login/registration when not authenticated

  return (
    <Layout>
      <SideMenu />
      <ContentContainer>
        <Router>
          <OrganizationPage path={Routes.Organization} />
          <RegistrationPage path={Routes.Register} />
          <BookingsPage path={Routes.Bookings} />
          <LoginPage path={Routes.SignIn} />
        </Router>
      </ContentContainer>
    </Layout>
  )
}

export default withUserProvider(App)
