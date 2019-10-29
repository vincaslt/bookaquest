import { RouteComponentProps } from '@reach/router'
import { Col, Row } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import useLoading from '~/../commons/hooks/useLoading'
import { Organization } from '~/../commons/interfaces/organization'
import * as api from '../../api/application'
import { UserMembership } from '../../interfaces/user'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'
import Section from '../../shared/layout/Section'
import CreateOrganizationForm from './CreateOrganization/CreateOrganizationForm'
import CreateOrganizationSplash from './CreateOrganization/CreateOrganizationSplash'
import OrganizationDetails from './OrganizationDetails'
import OrganizationMembers from './OrganizationMembers'
import OrganizationSchedule from './OrganizationSchedule'
import Payments from './Payments/Payments'

const CreateOrganizationSection = styled(PageContent)`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

// TODO: let user pick organizations / multiple organizations support
function OrganizationPage(props: RouteComponentProps) {
  const { userInfo, setUserInfo } = useUser()

  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one
  const organizationId = membership && membership.organizationId

  const [organization, setOrganization] = React.useState<Organization>()
  const [loading, withLoading] = useLoading(true)

  React.useEffect(() => {
    if (organizationId) {
      withLoading(api.getOrganization(organizationId).then(setOrganization))
    }
  }, [organizationId])

  const handleCreateOrganization = (memberships: UserMembership[]) =>
    userInfo && setUserInfo({ ...userInfo, memberships })

  return (
    <PageContent noBackground>
      {membership ? (
        <>
          <Row gutter={24}>
            <Col span={8}>
              <Section>
                <OrganizationDetails
                  loading={loading}
                  organization={organization}
                  onUpdateOrganization={setOrganization}
                />
              </Section>

              <Section>
                <OrganizationSchedule
                  organization={organization}
                  loading={loading}
                  setOrganization={setOrganization}
                />
              </Section>
            </Col>
            <Col span={8}>
              <Section>
                <OrganizationMembers organizationId={membership.organizationId} />
              </Section>
            </Col>
            <Col span={8}>
              <Section>
                <Payments organization={organization} setOrganization={setOrganization} />
              </Section>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <CreateOrganizationSplash />
          <CreateOrganizationSection>
            <CreateOrganizationForm onCreateOrganization={handleCreateOrganization} />
          </CreateOrganizationSection>
        </>
      )}
    </PageContent>
  )
}

export default OrganizationPage
