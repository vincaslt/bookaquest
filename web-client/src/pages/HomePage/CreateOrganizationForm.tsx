import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components'

const FormContainer = styled.div`
  max-width: 512px;
`

function CreateOrganizationForm(props: RouteComponentProps) {
  return <FormContainer>Create Organization Form</FormContainer>
}

export default CreateOrganizationForm
