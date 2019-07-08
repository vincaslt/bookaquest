import { JSONSchema6 } from 'json-schema'
import assocPath from 'ramda/es/assocPath'
import * as React from 'react'
import { UiSchema } from 'react-jsonschema-form'

export interface FormConfig {
  schema: JSONSchema6
  uiSchema: UiSchema
}

interface FormBuilderState {
  config: FormConfig
  selectedField: JSONSchema6 | null
  selectedFieldName: string | null
  selectField: (name: string | null) => void
  changeFieldProperty: (property: string, value: any) => void
  addField: (name: string) => void
}

const FormBuilderContext = React.createContext<FormBuilderState | null>(null)

interface Props {
  initialConfig: FormConfig
  children: React.ReactNode
}

export const FormBuilderProvider = ({ initialConfig, children }: Props) => {
  const [config, setConfig] = React.useState(initialConfig)
  const [selectedFieldName, selectField] = React.useState<string | null>(null)

  const selectedField =
    config.schema.properties && selectedFieldName
      ? (config.schema.properties[selectedFieldName] as JSONSchema6)
      : null

  const changeFieldProperty = (property: string, value: any) =>
    selectedFieldName &&
    setConfig(assocPath(['schema', 'properties', selectedFieldName, property], value))

  const addField = (fieldName: string) =>
    setConfig(assocPath(['schema', 'properties', fieldName], { type: 'string' }))

  return (
    <FormBuilderContext.Provider
      value={{
        config,
        selectedField,
        selectField,
        changeFieldProperty,
        selectedFieldName,
        addField
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  )
}

export const useFormBuilder = () => React.useContext(FormBuilderContext) as FormBuilderState
