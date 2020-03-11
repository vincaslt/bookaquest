import { Router } from '@reach/router';
import * as React from 'react';
import { PrivateRoutes as Routes } from './constants/routes';
import { BookingsPage } from './pages/BookingsPage/BookingsPage';
import { EscapeRoomPage } from './pages/EscapeRoomPage/EscapeRoomPage';
import { EscapeRoomsPage } from './pages/EscapeRoomsPage/EscapeRoomsPage';
import { OrganizationPage } from './pages/OrganizationPage/OrganizationPage';
import { IntegrationPage } from './pages/IntegrationPage/IntegrationPage';
import { PageNotFound } from './pages/PageNotFound';

export function PrivateRoutes() {
  return (
    <Router>
      <OrganizationPage path={Routes.Organization} />
      <BookingsPage path={Routes.Bookings} />
      <BookingsPage path={Routes.Booking} />
      <EscapeRoomPage path={Routes.EscapeRoom} />
      <EscapeRoomsPage path={Routes.EscapeRooms} />
      <IntegrationPage path={Routes.Integration} />
      <PageNotFound default />
    </Router>
  );
}
