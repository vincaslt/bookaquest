import { Router } from '@reach/router'
import { Spin } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import Routes from './constants/routes'
import HomePage from './pages/HomePage/HomePage'
import RegistrationPage from './pages/RegistrationPage/RegistrationPage'
import './utils/i18n'

const AppSpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
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
      <Router>
        <HomePage path={Routes.Home} />
        <RegistrationPage path={Routes.Register} />
      </Router>
    </React.Suspense>
  )
}

export default App
