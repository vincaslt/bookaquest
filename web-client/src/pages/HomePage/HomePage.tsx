import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components'
import { UserMembership } from '../../interfaces/user'
import PageContent from '../../shared/PageContent'
import { useUser } from '../../shared/providers/UserProvider'
import CreateOrganizationForm from './CreateOrganizationForm'
import CreateOrganizationSplash from './CreateOrganizationSplash'

const CreateOrganizationSection = styled(PageContent)`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

function HomePage(props: RouteComponentProps) {
  const { userInfo, setUserInfo } = useUser()

  const handleCreateOrganization = (memberships: UserMembership[]) =>
    userInfo && setUserInfo({ ...userInfo, memberships })

  return (
    <div>
      {!userInfo || userInfo.memberships.length === 0 ? (
        <>
          <CreateOrganizationSplash />
          <CreateOrganizationSection>
            <CreateOrganizationForm onCreateOrganization={handleCreateOrganization} />
          </CreateOrganizationSection>
        </>
      ) : (
        'HOME haz orgs'
      )}
    </div>
  )
}

export default HomePage
