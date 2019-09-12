import { RouteComponentProps } from '@reach/router'
import TuiCalendar from '@toast-ui/react-calendar'
import * as React from 'react'
import { ISchedule } from 'tui-calendar'
import * as api from '../../api/application'
import { Booking } from '../../interfaces/booking'
import useLoading from '../../shared/hooks/useLoading'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'

const getScheduleMapper = (organizationId: string) => (booking: Booking): ISchedule => ({
  id: booking.id,
  category: 'time',
  calendarId: organizationId,
  start: booking.startDate,
  end: booking.endDate,
  title: booking.name,
  isReadOnly: true
})

function BookingsPage(props: RouteComponentProps) {
  const { userInfo } = useUser()
  const [isLoading, withLoading] = useLoading(true)
  const [bookings, setBookings] = React.useState<Booking[]>([])

  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one

  React.useEffect(() => {
    if (membership) {
      withLoading(api.getOrganizationBookings(membership.organization.id).then(setBookings))
    }
  }, [])

  return (
    <PageContent>
      {!isLoading && membership && (
        <TuiCalendar
          taskView={false}
          scheduleView={['time']}
          schedules={bookings.map(getScheduleMapper(membership!.organization.id))}
          height="auto"
          view="week"
        />
      )}
    </PageContent>
  )
}

export default BookingsPage
