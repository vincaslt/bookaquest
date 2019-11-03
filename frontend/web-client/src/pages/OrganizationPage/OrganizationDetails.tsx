import { Typography } from 'antd'
import * as React from 'react'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import DetailsList from '../../shared/components/DetailsList'
import EditableText from '../../shared/components/EditableText'

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
    <DetailsList
      title={t`Organization details`}
      loading={loading}
      data={
        organization && [
          { label: t`ID:`, content: <Text copyable>{organization.id}</Text> },
          {
            label: t`Name:`,
            content: (
              <EditableText className="inline-flex items-center" onChange={handleChange('name')}>
                {organization.name}
              </EditableText>
            )
          },
          {
            label: t`Website:`,
            content: (
              <EditableText onChange={handleChange('website')}>{organization.website}</EditableText>
            )
          },
          {
            label: t`Location:`,
            content: (
              <EditableText onChange={handleChange('location')}>
                {organization.location}
              </EditableText>
            )
          }
        ]
      }
    />
  )
}

export default OrganizationDetails
