import * as React from 'react'
import * as api from '../../../api/application'
import { EscapeRoom } from '../../../interfaces/escapeRoom'
import CreateEscapeRoom from './CreateEscapeRooms'
import NoEscapeRooms from './NoEscapeRooms'

interface Props {
  organizationId: string
}

function EscapeRooms({ organizationId }: Props) {
  const [isCreating, setIsCreating] = React.useState(false)
  const [escapeRooms, setEscapeRooms] = React.useState<EscapeRoom[]>([])

  React.useEffect(() => {
    api.getEscapeRooms(organizationId).then(setEscapeRooms)
  }, [])

  if (isCreating) {
    return <CreateEscapeRoom organizationId={organizationId} />
  }

  return escapeRooms.length > 0 ? (
    <>{JSON.stringify(escapeRooms)}</>
  ) : (
    <NoEscapeRooms onClickCTA={() => setIsCreating(true)} />
  )
}

export default EscapeRooms
