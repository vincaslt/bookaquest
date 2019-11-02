import { Link, RouteComponentProps } from '@reach/router'
import { Button, Result } from 'antd'
import * as React from 'react'
import { useI18n } from '~/../commons/utils/i18n'
import { PrivateRoutes } from '../constants/routes'

function PageNotFound(props: RouteComponentProps) {
  const { t } = useI18n()

  return (
    <Result
      status="404"
      title={t`Not found`}
      subTitle={t`Sorry, the page you visited does not exist.`}
      extra={
        <Link to={PrivateRoutes.Dashboard}>
          <Button type="primary">{t`Go to dashboard`}</Button>
        </Link>
      }
    />
  )
}

export default PageNotFound
