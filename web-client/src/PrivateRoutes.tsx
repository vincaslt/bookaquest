import { Router } from '@reach/router'
import * as React from 'react'
import { PrivateRoutes as Routes } from './constants/routes'
import BookingsPage from './pages/BookingsPage/BookingsPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import OrganizationPage from './pages/OrganizationPage/OrganizationPage'

function PrivateRoutes() {
  return (
    <Router>
      <DashboardPage path={Routes.Dashboard} />
      <OrganizationPage path={Routes.Organization} />
      <BookingsPage path={Routes.Bookings} />
    </Router>
  )
}

export default PrivateRoutes
