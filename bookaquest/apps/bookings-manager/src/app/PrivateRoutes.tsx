import { Router, Redirect } from '@reach/router';
import * as React from 'react';
import { PrivateRoutes as Routes } from './constants/routes';
import { BookingsPage } from './pages/BookingsPage/BookingsPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { EscapeRoomPage } from './pages/EscapeRoomPage/EscapeRoomPage';
import { EscapeRoomsPage } from './pages/EscapeRoomsPage/EscapeRoomsPage';
import { OrganizationPage } from './pages/OrganizationPage/OrganizationPage';
import { PageNotFound } from './pages/PageNotFound';
import { useUser } from './shared/hooks/useUser';

const RequireOrganization = ({
  component,
  path
}: {
  component: React.ReactType<{ path: string }>;
  path: string;
}) => {
  const { userInfo } = useUser();

  const membership = userInfo && userInfo.memberships[0];
  const Route = component;

  return membership ? (
    <Route path={path} />
  ) : (
    <Redirect from={path} to={Routes.Organization} />
  );
};

export function PrivateRoutes() {
  return (
    <Router>
      <OrganizationPage path={Routes.Organization} />
      <RequireOrganization component={DashboardPage} path={Routes.Dashboard} />
      <RequireOrganization component={BookingsPage} path={Routes.Bookings} />
      <RequireOrganization
        component={EscapeRoomPage}
        path={Routes.EscapeRoom}
      />
      <RequireOrganization
        component={EscapeRoomsPage}
        path={Routes.EscapeRooms}
      />
      <PageNotFound default />
    </Router>
  );
}
