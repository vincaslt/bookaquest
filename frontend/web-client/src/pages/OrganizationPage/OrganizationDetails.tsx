import { Descriptions, Spin, Typography } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'

const DetailContainer = styled.div`
  display: flex;
  min-height: 35px;
`

const { Text } = Typography

interface Props {
  loading: boolean
  organization?: Organization
  onUpdateOrganization: (organization: Organization) => void
}

function OrganizationDetails({ loading, organization, onUpdateOrganization }: Props) {
  const { t } = useI18n()

  const handleChange = (key: 'name' | 'website' | 'location') => (value: string) =>
    organization &&
    api.updateOrganization(organization.id, { [key]: value }).then(onUpdateOrganization)

  return (
    <>
      <Descriptions title={t`Organization details`} />
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        organization && (
          <>
            <DetailContainer>
              <span className="font-medium mr-4">{t`ID:`}</span>
              <Text copyable>{organization.id}</Text>
            </DetailContainer>
            <DetailContainer>
              <span className="font-medium mr-4">{t`Name:`}</span>
              <Text editable={{ onChange: handleChange('name') }}>{organization.name}</Text>
            </DetailContainer>
            <DetailContainer>
              <span className="font-medium mr-4">{t`Website:`}</span>
              <Text editable={{ onChange: handleChange('website') }}>{organization.website}</Text>
            </DetailContainer>
            <DetailContainer>
              <span className="font-medium mr-4">{t`Location:`}</span>
              <Text editable={{ onChange: handleChange('location') }}>{organization.location}</Text>
            </DetailContainer>
          </>
        )
      )}
    </>
  )
}

export default OrganizationDetails
