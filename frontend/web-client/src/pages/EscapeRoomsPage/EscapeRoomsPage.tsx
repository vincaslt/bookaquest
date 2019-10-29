import { RouteComponentProps } from '@reach/router'
import { Col, Row } from 'antd'
import * as React from 'react'
import useLoading from '~/../commons/hooks/useLoading'
import { Organization } from '~/../commons/interfaces/organization'
import * as api from '../../api/application'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'
import EscapeRooms from './EscapeRooms'

function EscapeRoomsPage(props: RouteComponentProps) {
  const { userInfo } = useUser()
  const [organization, setOrganization] = React.useState<Organization>()
  const [loading, withLoading] = useLoading(true)

  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one
  const organizationId = membership && membership.organizationId

  React.useEffect(() => {
    if (organizationId) {
      withLoading(api.getOrganization(organizationId).then(setOrganization))
    }
  }, [organizationId])

  return (
    <PageContent noBackground>
      <Row gutter={24}>
        <Col>{!loading && <EscapeRooms organization={organization} />}</Col>
      </Row>
    </PageContent>
  )
}

export default EscapeRoomsPage
