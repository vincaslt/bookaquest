import { Descriptions, Typography } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import * as api from '../../api/application'
import { UserOrganization } from '../../interfaces/user'

const DetailContainer = styled.div`
  display: flex;
  min-height: 35px;
`

const DetailLabel = styled.span`
  margin-right: 16px;
`

const { Text } = Typography

interface Props {
  organization: UserOrganization
  onUpdateOrganization: (organization: UserOrganization) => void
}

function OrganizationDetails({ organization, onUpdateOrganization }: Props) {
  const { t } = useTranslation()

  const handleChange = (key: 'name' | 'website' | 'location') => (value: string) =>
    api.updateOrganization(organization.id, { [key]: value }).then(onUpdateOrganization)

  return (
    <>
      <Descriptions title={t('Organization details')} />
      <DetailContainer>
        <DetailLabel>{t('ID:')}</DetailLabel>
        <Text copyable>{organization.id}</Text>
      </DetailContainer>
      <DetailContainer>
        <DetailLabel>{t('Name:')}</DetailLabel>
        <Text editable={{ onChange: handleChange('name') }}>{organization.name}</Text>
      </DetailContainer>
      <DetailContainer>
        <DetailLabel>{t('Website:')}</DetailLabel>
        <Text editable={{ onChange: handleChange('website') }}>{organization.website}</Text>
      </DetailContainer>
      <DetailContainer>
        <DetailLabel>{t('Location:')}</DetailLabel>
        <Text editable={{ onChange: handleChange('location') }}>{organization.location}</Text>
      </DetailContainer>
    </>
  )
}

export default OrganizationDetails
