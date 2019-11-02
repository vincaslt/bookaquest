import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Booking } from '~/../commons/interfaces/booking'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import * as api from '../../api/application'
import PageContent from '../../shared/layout/PageContent'

interface UrlParams {
  escapeRoomId: string
}

function EscapeRoomPage(props: RouteComponentProps<UrlParams>) {
  const { escapeRoomId } = props
  const [escapeRoom, setEscapeRoom] = React.useState<EscapeRoom>()
  const [bookings, setBookings] = React.useState<Booking[]>()

  React.useEffect(() => {
    if (escapeRoomId) {
      Promise.all([api.getEscapeRoom(escapeRoomId), api.getEscapeRoomBookings(escapeRoomId)]).then(
        ([room, roomBookings]) => {
          setEscapeRoom(room)
          setBookings(roomBookings)
        }
      )
    }
  }, [escapeRoomId])

  return (
    <PageContent>
      <div className="mb-2">{escapeRoom && JSON.stringify(escapeRoom)}</div>
      <div>{bookings && JSON.stringify(bookings)}</div>
    </PageContent>
  )
}

export default EscapeRoomPage
