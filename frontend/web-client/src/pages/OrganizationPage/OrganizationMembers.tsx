import { List } from 'antd'
import * as React from 'react'
import useLoading from '~/../commons/hooks/useLoading'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import { OrganizationMember } from '../../interfaces/organizationMember'
import SectionTitle from '../../shared/components/SectionTitle'

interface Props {
  organizationId: string
}

function OrganizationMembers({ organizationId }: Props) {
  const [loading, withLoading] = useLoading(true)
  const [members, setMembers] = React.useState<OrganizationMember[]>([])
  const { t } = useI18n()

  React.useEffect(() => {
    withLoading(api.getOrganizationMembers(organizationId).then(setMembers))
  }, [organizationId])

  return (
    <>
      <SectionTitle>{t`Members`}</SectionTitle>
      <List loading={loading}>
        {members.map(member => (
          <List.Item key={member.userId} actions={[<a key="remove-user">{t`remove`}</a>]}>
            <List.Item.Meta title={member.user.fullName} description={member.user.email} />
            {member.isOwner ? <strong>{t`Owner`}</strong> : <div>{t`Member`}</div>}
          </List.Item>
        ))}
      </List>
    </>
  )
}

export default OrganizationMembers
