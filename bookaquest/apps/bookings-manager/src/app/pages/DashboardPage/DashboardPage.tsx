import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { PageContent } from '../../shared/layout/PageContent';
import { useI18n } from '@bookaquest/utilities';

export function DashboardPage(props: RouteComponentProps) {
  const { t } = useI18n();
  return <PageContent>{t`Dashboard Page`}</PageContent>;
}
