import { RouteComponentProps } from '@reach/router'
import TuiCalendar from '@toast-ui/react-calendar'
import * as React from 'react'
import PageContent from '../../shared/PageContent'

function BookingsPage(props: RouteComponentProps) {
  return (
    <PageContent>
      <TuiCalendar />
    </PageContent>
  )
}

export default BookingsPage
