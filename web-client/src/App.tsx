import { Router } from '@reach/router'
import { Layout, Spin } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import Routes from './constants/routes'
import BookingsPage from './pages/BookingsPage/BookingsPage'
import FormBuilder from './pages/FormBuilder/FormBuilder'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegistrationPage from './pages/RegistrationPage/RegistrationPage'
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
  margin-left: 200px;
  min-height: 100vh;
  padding: 24px 16px 0;
`

function App() {
  return (
    <React.Suspense
      fallback={
        <AppSpinnerContainer>
          <Spin size="large" />
        </AppSpinnerContainer>
      }
    >
      <Layout>
        <SideMenu />
        <ContentContainer>
          <Router>
            <HomePage path={Routes.Home} />
            <RegistrationPage path={Routes.Register} />
            <FormBuilder path={Routes.FormBuilder} />
            <BookingsPage path={Routes.Bookings} />
            <LoginPage path={Routes.SignIn} />
          </Router>
        </ContentContainer>
      </Layout>
    </React.Suspense>
  )
}

export default App
