import { Link, RouteComponentProps } from '@reach/router';
import { Button, Result } from 'antd';
import * as React from 'react';
import { useI18n } from '@bookaquest/utilities';
import { PrivateRoutes } from '../constants/routes';
import { PageContent } from '../shared/layout/PageContent';

export function PageNotFound(props: RouteComponentProps) {
  const { t } = useI18n();

  return (
    <PageContent noBackground>
      <Result
        status="404"
        title={t`Not found`}
        subTitle={t`Sorry, the page you visited does not exist.`}
        extra={
          <Link to={PrivateRoutes.Bookings}>
            <Button type="primary">{t`Go to dashboard`}</Button>
          </Link>
        }
      />
    </PageContent>
  );
}
