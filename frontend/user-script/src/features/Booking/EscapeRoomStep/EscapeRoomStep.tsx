import { List } from 'antd'
import * as React from 'react'
import EscapeRoomCard from '~/../commons/components/EscapeRoomCard'
import { EscapeRoom } from '~/../commons/interfaces/escapeRoom'
import * as api from '../../../api/application'

interface Props {
  organizationId: string
  onSelect: (room: EscapeRoom) => void
}

function EscapeRoomStep({ organizationId, onSelect }: Props) {
  const [loading, setLoading] = React.useState(true)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  React.useEffect(() => {
    api
      .getEscapeRooms(organizationId)
      .then(setEscapeRooms)
      .finally(() => setLoading(false))
  }, [])

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
          <EscapeRoomCard escapeRoom={escapeRoom} onSelect={onSelect} />
        </List.Item>
      )}
    />
  )
}

export default EscapeRoomStep
