import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import LoginForm from './LoginForm'

function LoginPage(props: RouteComponentProps) {
  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default LoginPage
