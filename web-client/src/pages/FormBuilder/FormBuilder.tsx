import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components'
import PageContent from '../../shared/PageContent'
import { FormConfig, FormEditProvider, GeneratedForm, useFormEdit } from './lib'
import dummyConfig from './lib/__formConfig'
import Toolbar from './Toolbar/Toolbar'

const FormBuilderContainer = styled.div`
  position: relative;
  display: flex;
`

const DummyContent = styled.div`
  height: 500px;
`

function Test() {
  const editor = useFormEdit()

  return editor && <div>Test selected {editor.selectedProperty}</div>
}

function FormBuilder(props: RouteComponentProps) {
  const [formConfig, setFormConfig] = React.useState<FormConfig>(dummyConfig)

  return (
    <FormEditProvider>
      <FormBuilderContainer>
        <PageContent>
          <GeneratedForm uiSchema={formConfig.uiSchema} schema={formConfig.schema} />
          <DummyContent>
            <Test />
          </DummyContent>
          .
        </PageContent>
        <Toolbar config={formConfig} onChangeConfig={setFormConfig} />
      </FormBuilderContainer>
    </FormEditProvider>
  )
}

export default FormBuilder
