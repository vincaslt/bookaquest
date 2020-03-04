import { Layout, Spin } from 'antd';
import { Router } from '@reach/router';
import * as React from 'react';
import styled from 'styled-components';
import { useI18n } from '@bookaquest/utilities';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import { useUser } from './shared/hooks/useUser';
import { PrivateHeader } from './shared/layout/Header/PrivateHeader';
import { SideMenu } from './shared/layout/SideMenu';
import { withUserProvider } from './shared/providers/UserProvider';
import { CreateOrganizationPage } from './pages/CreateOrganizationPage/CreateOrganizationPage';
import UnverifiedEmailPage from './pages/UnverifiedEmailPage';

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

const PageWithSidebarContainer = styled(Layout)<{ collapsed: boolean }>`
  margin-left: ${({ collapsed }) => (collapsed ? '80px' : '256px')};
  min-height: 100vh;
`;

// TODO: format currency and numbers based on selected locale
export const App = withUserProvider(() => {
  const { isLoading, userInfo, memberships } = useUser();
  const { i18n } = useI18n(undefined, { useSuspense: false });
  const [collapsed, setCollapsed] = React.useState(false);

  if (isLoading || !i18n.ready) {
    return (
      <AppSpinnerContainer>
        <Spin size="large" />
      </AppSpinnerContainer>
    );
  }

  if (!userInfo) {
    return (
      <Layout>
        <PageContainer>
          <PublicRoutes />
        </PageContainer>
      </Layout>
    );
  }

  if (!userInfo.verified) {
    return (
      <Layout>
        <PageContainer>
          <PrivateHeader />
          <Router>
            <UnverifiedEmailPage default />
          </Router>
        </PageContainer>
      </Layout>
    );
  }

  if (!memberships?.[0]) {
    return (
      <Layout>
        <PageContainer>
          <PrivateHeader />
          <CreateOrganizationPage />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <SideMenu onCollapse={setCollapsed} />
      <PageWithSidebarContainer collapsed={collapsed}>
        <PrivateHeader sidebarVisible sidebarWidth={collapsed ? 80 : 256} />
        <PrivateRoutes />
      </PageWithSidebarContainer>
    </Layout>
  );
});
