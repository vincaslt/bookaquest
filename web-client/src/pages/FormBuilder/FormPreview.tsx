import * as React from 'react'
import Form, { ObjectFieldTemplateProps } from 'react-jsonschema-form'
import styled from 'styled-components'
import { useFormBuilder } from './FormBuilderProvider'
import TimeSlotPicker from './TimeSlotPicker'

const fields = { timeslot: TimeSlotPicker }

const SelectableField = styled.div`
  padding: 10px;
  position: relative;
  border: 1px solid ${({ selected }: { selected: boolean }) => (selected ? 'red' : 'grey')};
  cursor: pointer;

  &:hover {
    border: 1px solid red;
  }
`

function FieldWrapper(props: ObjectFieldTemplateProps) {
  const { selectField, selectedField } = useFormBuilder()

  const handleSelectField = (name: string) => () => selectField(name)

  return (
    <>
      <legend>{props.title}</legend>
      <p>{props.description}</p>
      {props.properties.map((element, i) => (
        <SelectableField
          selected={selectedField === element.name}
          key={element.name}
          onClick={handleSelectField(element.name)}
        >
          {element.content}
        </SelectableField>
      ))}
    </>
  )
}

export function FormPreview() {
  const { config } = useFormBuilder()
  return (
    <Form
      schema={config.schema}
      uiSchema={config.uiSchema}
      fields={fields}
      ObjectFieldTemplate={FieldWrapper}
    />
  )
}

export default FormPreview
