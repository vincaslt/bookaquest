import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { useI18n } from '~/../commons/utils/i18n'
import PageContent from '../../shared/layout/PageContent'

function DashboardPage(props: RouteComponentProps) {
  const { t } = useI18n()
  return <PageContent>{t`Dashboard Page`}</PageContent>
}

export default DashboardPage
