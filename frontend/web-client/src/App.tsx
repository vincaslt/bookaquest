import { hot } from 'react-hot-loader'

import { Layout, Spin } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import useUser from './shared/hooks/useUser'
import SideMenu from './shared/layout/SideMenu'
import { withUserProvider } from './shared/providers/UserProvider'

const AppSpinnerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`

const PageContainer = styled(Layout)`
  min-height: 100vh;
`

const PageWithSidebarContainer = styled(Layout)`
  margin-left: 256px;
  min-height: 100vh;
`

const StyledHeader = styled(Layout.Header)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  padding: 16px 24px;
`

function App() {
  const { isLoading, userInfo } = useUser()
  const { ready } = useI18n(undefined, { useSuspense: false })

  if (isLoading || !ready) {
    return (
      <AppSpinnerContainer>
        <Spin size="large" />
      </AppSpinnerContainer>
    )
  }

  return (
    <Layout>
      {userInfo ? (
        <>
          <SideMenu />
          <PageWithSidebarContainer>
            <StyledHeader>{userInfo && userInfo.email}</StyledHeader>
            <PrivateRoutes />
          </PageWithSidebarContainer>
        </>
      ) : (
        <PageContainer>
          <StyledHeader />
          <PublicRoutes />
        </PageContainer>
      )}
    </Layout>
  )
}

export default hot(module as any)(withUserProvider(App))
