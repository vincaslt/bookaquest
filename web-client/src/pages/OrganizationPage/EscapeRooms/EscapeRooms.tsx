import * as React from 'react'
import CreateEscapeRoom from './CreateEscapeRooms'
import NoEscapeRooms from './NoEscapeRooms'

interface Props {
  organizationId: string
}

function EscapeRooms({ organizationId }: Props) {
  const [isCreating, setIsCreating] = React.useState()
  const escapeRooms = [] // TODO: query

  if (isCreating) {
    return <CreateEscapeRoom organizationId={organizationId} />
  }

  return escapeRooms.length > 0 ? (
    <>TODO Escape rooms list</>
  ) : (
    <NoEscapeRooms onClickCTA={() => setIsCreating(true)} />
  )
}

export default EscapeRooms
