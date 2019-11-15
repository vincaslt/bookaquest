import { RouteComponentProps } from '@reach/router';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import { PageContent } from '../../shared/layout/PageContent';

export function DashboardPage(props: RouteComponentProps) {
  const { t } = useI18n();
  return <PageContent>{t`Dashboard Page`}</PageContent>;
}
