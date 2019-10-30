import { List } from 'antd'
import * as React from 'react'
import { useRoute } from 'wouter'
import { useLocation } from 'wouter'
import EscapeRoomCard from '~/../commons/components/EscapeRoomCard'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import * as api from '../../api/application'

function EscapeRoomSelect() {
  const [, params] = useRoute<{ organizationId: string }>('/:organizationId')
  const [, setLocation] = useLocation()
  const [loading, setLoading] = React.useState(true)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  const organizationId = params && params.organizationId

  React.useEffect(() => {
    if (organizationId) {
      api
        .getEscapeRooms(organizationId)
        .then(setEscapeRooms)
        .finally(() => setLoading(false))
    }
  }, [organizationId])

  const handleSelectEscapeRoom = (room: EscapeRoom) => setLocation(`/${organizationId}/${room.id}`)

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 2
      }}
      loading={loading}
      dataSource={escapeRooms}
      renderItem={escapeRoom => (
        <List.Item>
          <EscapeRoomCard escapeRoom={escapeRoom} onSelect={handleSelectEscapeRoom} />
        </List.Item>
      )}
    />
  )
}

export default EscapeRoomSelect
