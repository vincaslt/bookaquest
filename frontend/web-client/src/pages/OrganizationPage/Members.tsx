import { Descriptions, List } from 'antd'
import * as React from 'react'
import useLoading from '~/../commons/hooks/useLoading'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import { OrganizationMember } from '../../interfaces/organizationMember'

interface Props {
  organizationId: string
}

function Members({ organizationId }: Props) {
  const [loading, withLoading] = useLoading(true)
  const [members, setMembers] = React.useState<OrganizationMember[]>([])
  const { t } = useI18n()

  React.useEffect(() => {
    withLoading(api.getOrganizationMembers(organizationId).then(setMembers))
  }, [organizationId])

  return (
    <>
      <Descriptions title={t`Members`} />
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

export default Members
