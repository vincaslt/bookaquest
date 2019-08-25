import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components'
import PageContent from '../../shared/PageContent'
import dummyConfig from './__formConfig'
import { FormBuilderProvider } from './FormBuilderProvider'
import FormPreview from './FormPreview'
import Toolbar from './Toolbar/Toolbar'

const FormBuilderContainer = styled.div`
  position: relative;
  display: flex;
`

function FormBuilder(props: RouteComponentProps) {
  return (
    <FormBuilderProvider initialConfig={dummyConfig}>
      <FormBuilderContainer>
        <PageContent>
          <FormPreview />
        </PageContent>
        <Toolbar />
      </FormBuilderContainer>
    </FormBuilderProvider>
  )
}

export default FormBuilder
