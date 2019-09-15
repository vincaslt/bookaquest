import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import PageContent from '../../shared/layout/PageContent'
import LoginForm from './LoginForm'

function LoginPage(props: RouteComponentProps) {
  return (
    <PageContent>
      <LoginForm />
    </PageContent>
  )
}

export default LoginPage
