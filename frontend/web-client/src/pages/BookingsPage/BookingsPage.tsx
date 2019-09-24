import FullCalendar from '@fullcalendar/react'
import timeGridWeek from '@fullcalendar/timegrid'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import useLoading from '~/../commons/hooks/useLoading'
import { Booking, BookingStatus } from '~/../commons/interfaces/booking'
import * as api from '../../api/application'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'
import PendingEventModal from './PendingEventModal'

// TODO: show bookings as resources (per escape room)
function BookingsPage(props: RouteComponentProps) {
  const popupContainer = React.useRef<HTMLElement>()
  const { userInfo } = useUser()
  const [isLoading, withLoading] = useLoading(true)
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [selectedBooking, selectBooking] = React.useState<Booking>()

  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one

  React.useEffect(() => {
    if (membership) {
      withLoading(api.getOrganizationBookings(membership.organization.id).then(setBookings))
    }

    popupContainer.current = document.createElement('div')
    document.body.appendChild(popupContainer.current)
  }, [])

  const handleCloseModal = () => selectBooking(undefined)

  return (
    <PageContent>
      {!isLoading && membership && (
        <FullCalendar
          defaultView="timeGridWeek"
          plugins={[timeGridWeek]}
          eventClick={info => selectBooking(info.event.extendedProps.booking)}
          events={{
            events: bookings.map(booking => ({
              title: booking.name,
              start: booking.startDate,
              end: booking.endDate,
              borderColor: 'rgba(0,0,0,0.8)',
              textColor: 'rgba(0,0,0,0.8)',
              backgroundColor: {
                [BookingStatus.Accepted]: '#b7eb8f',
                [BookingStatus.Pending]: '#ffe58f',
                [BookingStatus.Rejected]: '#ffa39e'
              }[booking.status],
              booking
            }))
          }}
        />
      )}
      {selectedBooking && (
        <PendingEventModal
          setBookings={setBookings}
          onClose={handleCloseModal}
          booking={selectedBooking}
        />
      )}
    </PageContent>
  )
}

export default BookingsPage
