import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import PageContent from '../../shared/PageContent'
import RegistrationForm from './RegistrationForm'

function RegistrationPage(props: RouteComponentProps) {
  return (
    <PageContent>
      <RegistrationForm />
    </PageContent>
  )
}

export default RegistrationPage
