import { RouteComponentProps } from '@reach/router'
import { Button, Descriptions, Spin } from 'antd'
import * as React from 'react'
import useLoading from '~/../commons/hooks/useLoading'
import { Organization } from '~/../commons/interfaces/organization'
import { useI18n } from '~/../commons/utils/i18n'
import * as api from '../../api/application'
import useUser from '../../shared/hooks/useUser'
import PageContent from '../../shared/layout/PageContent'
import Section from '../../shared/layout/Section'
import PaymentDetailsForm from './PaymentDetailsForm'

function PaymentsPage(props: RouteComponentProps) {
  const { t } = useI18n()
  const { userInfo } = useUser()
  const membership = userInfo && userInfo.memberships[0] // TODO: use selected, instead of first one
  const organizationId = membership && membership.organizationId

  const [editing, setEditing] = React.useState(false)
  const [organization, setOrganization] = React.useState<Organization>()
  const [loading, withLoading] = useLoading(true)

  React.useEffect(() => {
    if (organizationId) {
      withLoading(api.getOrganization(organizationId).then(setOrganization))
    }
  }, [organizationId])

  if (!organizationId) {
    return null
  }

  const isEditing = editing || !organization || !organization.paymentDetails

  const handleToggleEditing = () => setEditing(!isEditing)
  const handleUpdateDone = (org: Organization) => {
    setOrganization(org)
    setEditing(false)
  }

  return (
    <PageContent noBackground>
      <Section>
        <div className="flex justify-between">
          <Descriptions title={t`Stripe payment details`} />
          <Button type="link" onClick={handleToggleEditing}>
            {isEditing ? t`Cancel` : t`Edit`}
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Spin />
          </div>
        ) : isEditing ? (
          <PaymentDetailsForm organizationId={organizationId} onUpdateDone={handleUpdateDone} />
        ) : (
          <div>
            <div>
              <span className="font-medium mr-2">{t`Client key:`}</span>
              {organization!.paymentDetails!.paymentClientKey}
            </div>
            <div>
              <span className="font-medium mr-2">{t`Secret key:`}</span>
              {organization!.paymentDetails!.paymentClientKey}
            </div>
          </div>
        )}
      </Section>
    </PageContent>
  )
}

export default PaymentsPage
