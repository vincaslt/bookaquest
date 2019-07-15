import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import PageContent from '../../shared/PageContent'
import CreateScheduleForm from './CreateScheduleForm'

function BookingsPage(props: RouteComponentProps) {
  return (
    <PageContent>
      <CreateScheduleForm />
    </PageContent>
  )
}

export default BookingsPage
