import * as React from 'react'
import { UserMembership } from '../../../interfaces/user'
import useUser from '../../../shared/hooks/useUser'
import PageContent from '../../../shared/layout/PageContent'
import CreateOrganizationForm from './CreateOrganizationForm'
import CreateOrganizationSplash from './CreateOrganizationSplash'

function CreateOrganization() {
  const { userInfo, setUserInfo } = useUser()

  const handleCreateOrganization = (memberships: UserMembership[]) =>
    userInfo && setUserInfo({ ...userInfo, memberships })

  return (
    <PageContent className="flex flex-col items-center">
      <CreateOrganizationSplash />
      <CreateOrganizationForm onCreateOrganization={handleCreateOrganization} />
    </PageContent>
  )
}

export default CreateOrganization
