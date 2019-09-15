import { RouteComponentProps } from '@reach/router'
import { Col, Row } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { UserMembership, UserOrganization } from '../../interfaces/user'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'
import Section from '../../shared/layout/Section'
import CreateOrganizationForm from './CreateOrganization/CreateOrganizationForm'
import CreateOrganizationSplash from './CreateOrganization/CreateOrganizationSplash'
import CreateScheduleForm from './CreateScheduleForm'
import EscapeRooms from './EscapeRooms/EscapeRooms'
import Members from './Members'
import OrganizationDetails from './OrganizationDetails'

const CreateOrganizationSection = styled(PageContent)`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

// TODO: let user pick organizations / multiple organizations support
function OrganizationPage(props: RouteComponentProps) {
  const activeMembership = 0 // TODO: use selected, instead of first one
  const { userInfo, setUserInfo } = useUser()

  const handleCreateOrganization = (memberships: UserMembership[]) =>
    userInfo && setUserInfo({ ...userInfo, memberships })

  const handleUpdateOrganization = (organization: UserOrganization) => {
    if (!userInfo) {
      return
    }
    const memberships = [...userInfo.memberships]
    memberships[activeMembership].organization = organization
    setUserInfo({ ...userInfo, memberships })
  }

  const membership = userInfo && userInfo.memberships[activeMembership]

  return (
    <PageContent noBackground>
      {membership ? (
        <>
          <Row gutter={24}>
            <Col span={6}>
              <Section>
                <OrganizationDetails
                  organization={membership.organization}
                  onUpdateOrganization={handleUpdateOrganization}
                />
              </Section>

              <Section>
                <Members organizationId={membership.organization.id} />
              </Section>
            </Col>
            <Col span={18}>
              <Section>
                <CreateScheduleForm organizationId={membership.organization.id} />
              </Section>

              <EscapeRooms organizationId={membership.organization.id} />
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