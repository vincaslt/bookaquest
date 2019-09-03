import { RouteComponentProps } from '@reach/router'
import { Col, Row } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { UserMembership } from '../../interfaces/user'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/PageContent'
import CreateOrganizationForm from './CreateOrganizationForm'
import CreateOrganizationSplash from './CreateOrganizationSplash'
import CreateScheduleForm from './CreateScheduleForm'
import EscapeRooms from './EscapeRooms/EscapeRooms'
import Members from './Members'

const CreateOrganizationSection = styled(PageContent)`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Section = styled.div`
  background-color: white;
  padding: 20px;
  margin-bottom: 24px;
`

// TODO: let user pick organizations / multiple organizations support
function OrganizationPage(props: RouteComponentProps) {
  const { userInfo, setUserInfo } = useUser()

  const handleCreateOrganization = (memberships: UserMembership[]) =>
    userInfo && setUserInfo({ ...userInfo, memberships })

  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one

  return (
    <PageContent noBackground>
      {membership ? (
        <>
          <Row gutter={24}>
            <Col span={6}>
              <Section>
                <CreateOrganizationForm onCreateOrganization={handleCreateOrganization} />
              </Section>

              <Section>
                <Members organizationId={membership.organization.id} />
              </Section>
            </Col>
            <Col span={18}>
              <Section>
                <CreateScheduleForm organizationId={membership.organization.id} />
              </Section>

              <Section>
                <EscapeRooms organizationId={membership.organization.id} />
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
