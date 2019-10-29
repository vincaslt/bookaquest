import { Button, Descriptions, Spin } from 'antd'
import * as React from 'react'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import PaymentDetailsForm from './PaymentDetailsForm'

interface Props {
  organization?: Organization
  setOrganization: (organization: Organization) => void
}

function Payments({ organization, setOrganization }: Props) {
  const { t } = useI18n()

  const [editing, setEditing] = React.useState(false)

  const isEditing = editing || !organization || !organization.paymentDetails

  const handleToggleEditing = () => setEditing(!isEditing)
  const handleUpdateDone = (org: Organization) => {
    setOrganization(org)
    setEditing(false)
  }

  return (
    <>
      <div className="flex justify-between">
        <Descriptions title={t`Stripe payment details`} />
        <Button type="link" onClick={handleToggleEditing}>
          {isEditing ? t`Cancel` : t`Edit`}
        </Button>
      </div>
      {!organization ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : isEditing ? (
        <PaymentDetailsForm organizationId={organization.id} onUpdateDone={handleUpdateDone} />
      ) : (
        <div>
          <div>
            <span className="font-medium mr-2">{t`Client key:`}</span>
            {organization.paymentDetails!.paymentClientKey}
          </div>
          <div>
            <span className="font-medium mr-2">{t`Secret key:`}</span>
            {organization.paymentDetails!.paymentClientKey}
          </div>
        </div>
      )}
    </>
  )
}

export default Payments
