import 'bootstrap/dist/css/bootstrap.css' // TODO: make custom styles instead of bootstrap
import { JSONSchema6 } from 'json-schema'
import * as React from 'react'
import Form, { ObjectFieldTemplateProps, UiSchema } from 'react-jsonschema-form'
// import { render } from 'react-dom'
import styled from 'styled-components'
import TimeSlotPicker from './TimeSlotPicker'

export interface FormConfig {
  schema: JSONSchema6
  uiSchema: UiSchema
}

const fields = { timeslot: TimeSlotPicker }

interface FormEditState {
  selectedProperty: string
  selectProperty: (name: string) => void
}

const FormEditContext = React.createContext<FormEditState | null>(null)

export const FormEditProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedProperty, selectProperty] = React.useState('')
  return (
    <FormEditContext.Provider value={{ selectedProperty, selectProperty }}>
      {children}
    </FormEditContext.Provider>
  )
}

export const useFormEdit = () => React.useContext(FormEditContext)

// TODO: timeslots loaded independently of the form and activityId is being sent as a hidden field

const SelectableField = styled.div`
  &:hover {
    border: 1px solid red;
  }
`

function FieldWrapper(props: ObjectFieldTemplateProps) {
  const editor = useFormEdit()

  const handleSelectField = (name: string) => () => editor!.selectProperty(name)

  return (
    <>
      <legend>{props.title}</legend>
      <p>{props.description}</p>
      {props.properties.map((element, i) =>
        editor ? (
          <SelectableField key={element.name} onClick={handleSelectField(element.name)}>
            {element.content}
          </SelectableField>
        ) : (
          element.content
        )
      )}
    </>
  )
}

export function GeneratedForm({ schema, uiSchema }: FormConfig) {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      fields={fields}
      ObjectFieldTemplate={FieldWrapper}
      onChange={(...rest) => console.log('changed', rest)}
      onSubmit={(...rest) => console.log('submitted', rest)}
      onError={(...rest) => console.log('errors', rest)}
    />
  )
}

// export function renderForm(element: string, { schema, uiSchema }: FormConfig) {
//   render(
//     <Form
//       schema={schema}
//       uiSchema={uiSchema}
//       fields={fields}
//       onChange={(...rest) => console.log('changed', rest)}
//       onSubmit={(...rest) => console.log('submitted', rest)}
//       onError={(...rest) => console.log('errors', rest)}
//     />,
//     document.getElementById(element)!
//   )
// }
