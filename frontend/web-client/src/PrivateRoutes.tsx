import { Router } from '@reach/router'
import * as React from 'react'
import { PrivateRoutes as Routes } from './constants/routes'
import BookingsPage from './pages/BookingsPage/BookingsPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import EscapeRoomsPage from './pages/EscapeRoomsPage/EscapeRoomsPage'
import OrganizationPage from './pages/OrganizationPage/OrganizationPage'
import useUser from './shared/hooks/useUser'

function PrivateRoutes() {
  const { userInfo } = useUser()

  const membership = userInfo && userInfo.memberships[0]

  return (
    <Router>
      <DashboardPage path={Routes.Dashboard} />
      <OrganizationPage path={Routes.Organization} />
      {membership && <BookingsPage path={Routes.Bookings} />}
      {membership && <EscapeRoomsPage path={Routes.EscapeRooms} />}
    </Router>
  )
}

export default PrivateRoutes
