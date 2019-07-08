import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import RegistrationForm from './RegistrationForm'

function RegistrationPage(props: RouteComponentProps) {
  return (
    <div>
      <RegistrationForm />
    </div>
  )
}

export default RegistrationPage
