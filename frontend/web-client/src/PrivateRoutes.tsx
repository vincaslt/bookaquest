import { Router } from '@reach/router'
import * as React from 'react'
import { PrivateRoutes as Routes } from './constants/routes'
import BookingsPage from './pages/BookingsPage/BookingsPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import EscapeRoomPage from './pages/EscapeRoomPage/EscapeRoomPage'
import EscapeRoomsPage from './pages/EscapeRoomsPage/EscapeRoomsPage'
import OrganizationPage from './pages/OrganizationPage/OrganizationPage'
import PageNotFound from './pages/PageNotFound'
import useUser from './shared/hooks/useUser'

const withOrganization = (routeComponent: React.ReactElement<{ path: string }>) => {
  const { userInfo } = useUser()

  const membership = userInfo && userInfo.memberships[0]

  return membership ? routeComponent : <OrganizationPage path={routeComponent.props.path} />
}

function PrivateRoutes() {
  return (
    <Router>
      <OrganizationPage path={Routes.Organization} />
      {withOrganization(<DashboardPage path={Routes.Dashboard} />)}
      {withOrganization(<BookingsPage path={Routes.Bookings} />)}
      {withOrganization(<EscapeRoomPage path={Routes.EscapeRoom} />)}
      {withOrganization(<EscapeRoomsPage path={Routes.EscapeRooms} />)}
      <PageNotFound default />
    </Router>
  )
}

export default PrivateRoutes
