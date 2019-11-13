import { Layout, Spin } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import { useUser } from './shared/hooks/useUser';
import { PrivateHeader } from './shared/layout/Header/PrivateHeader';
import { SideMenu } from './shared/layout/SideMenu';
import { withUserProvider } from './shared/providers/UserProvider';
import { useI18n } from '@bookaquest/utilities';

const AppSpinnerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const PageContainer = styled(Layout)`
  min-height: 100vh;
`;

const PageWithSidebarContainer = styled(Layout)`
  margin-left: 256px;
  min-height: 100vh;
`;

export const App = withUserProvider(() => {
  const { isLoading, userInfo } = useUser();
  const { ready } = useI18n(undefined, { useSuspense: false });

  const membership = userInfo && userInfo.memberships[0];

  if (isLoading || !ready) {
    return (
      <AppSpinnerContainer>
        <Spin size="large" />
      </AppSpinnerContainer>
    );
  }

  return (
    <Layout>
      {userInfo ? (
        membership ? (
          <>
            <SideMenu />
            <PageWithSidebarContainer>
              <PrivateHeader sidebarVisible />
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
  );
});
