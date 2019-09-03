import { List } from 'antd'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '../../api/application'
import { OrganizationMember } from '../../interfaces/organizationMember'
import useLoading from '../../shared/hooks/useLoading'

interface Props {
  organizationId: string
}

function Members({ organizationId }: Props) {
  const [loading, withLoading] = useLoading(true)
  const [members, setMembers] = React.useState<OrganizationMember[]>([])
  const { t } = useTranslation()

  React.useEffect(() => {
    withLoading(api.getOrganizationMembers(organizationId).then(setMembers))
  }, [organizationId])

  return (
    <>
      <h3>{t('Members')}</h3>
      <List loading={loading}>
        {members.map(member => (
          <List.Item key={member.userId} actions={[<a key="remove-user">{t('remove')}</a>]}>
            <List.Item.Meta title={member.user.fullName} description={member.user.email} />
            {member.isOwner ? <strong>{t('Owner')}</strong> : <div>{t('Member')}</div>}
          </List.Item>
        ))}
      </List>
    </>
  )
}

export default Members
