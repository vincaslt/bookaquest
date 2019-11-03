import * as React from 'react'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import DetailsList from '../../../shared/components/DetailsList'
import Link from '../../../shared/components/Link'
import PaymentDetailsForm from './PaymentDetailsForm'

interface Props {
  organization?: Organization
  setOrganization: (organization: Organization) => void
}

function Payments({ organization, setOrganization }: Props) {
  const { t } = useI18n()

  const [editing, setEditing] = React.useState(false)

  const details = organization && organization.paymentDetails
  const isEditing = editing || !details

  const handleToggleEditing = () => setEditing(!isEditing)
  const handleUpdateDone = (org: Organization) => {
    setOrganization(org)
    setEditing(false)
  }

  return (
    <>
      <DetailsList
        loading={!organization}
        title={t`Stripe payment details`}
        extra={<Link onClick={handleToggleEditing}>{isEditing ? t`Cancel` : t`Edit`}</Link>}
        data={
          !isEditing &&
          details && [
            { label: t`Client key:`, content: details.paymentClientKey },
            { label: t`Secret key:`, content: '*********' }
          ]
        }
      />
      {isEditing && organization && (
        <PaymentDetailsForm organizationId={organization.id} onUpdateDone={handleUpdateDone} />
      )}
    </>
  )
}

export default Payments
