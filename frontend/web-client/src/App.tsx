import { hot } from 'react-hot-loader'

import { Layout, Spin } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import useUser from './shared/hooks/useUser'
import PrivateHeader from './shared/layout/Header/PrivateHeader'
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

function App() {
  const { isLoading, userInfo } = useUser()
  const { ready } = useI18n(undefined, { useSuspense: false })

  const membership = userInfo && userInfo.memberships[0]

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
        membership ? (
          <>
            <SideMenu />
            <PageWithSidebarContainer>
              <PrivateHeader />
              <PrivateRoutes />
            </PageWithSidebarContainer>
          </>
        ) : (
          <PageContainer>
            <PrivateHeader />
            <PrivateRoutes />
          </PageContainer>
        )
      ) : (
        <PageContainer>
          <PublicRoutes />
        </PageContainer>
      )}
    </Layout>
  )
}

export default hot(module as any)(withUserProvider(App))
