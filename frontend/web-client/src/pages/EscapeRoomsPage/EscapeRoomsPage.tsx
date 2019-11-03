import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Organization } from '~/../commons/interfaces/organization'
import * as api from '../../api/application'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'
import EscapeRooms from './EscapeRooms'

function EscapeRoomsPage(props: RouteComponentProps) {
  const { userInfo } = useUser()
  const [organization, setOrganization] = React.useState<Organization>()

  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one
  const organizationId = membership && membership.organizationId

  React.useEffect(() => {
    if (organizationId) {
      api.getOrganization(organizationId).then(setOrganization)
    }
  }, [organizationId])

  return (
    <PageContent noBackground>
      <EscapeRooms organization={organization} />
    </PageContent>
  )
}

export default EscapeRoomsPage
