import * as React from 'react'
import Form, { ObjectFieldTemplateProps } from 'react-jsonschema-form'
import styled from 'styled-components'
import { useFormBuilder } from './FormBuilderProvider'
import TimeSlotPicker from './TimeSlotPicker'

const fields = { timeslot: TimeSlotPicker }

const SelectableField = styled.div<{ selected: boolean }>`
  padding: 10px;
  position: relative;
  cursor: pointer;
  ${({ selected }) => selected && 'background-color: #f5f5f5'};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#f5f5f5' : '#fcfcfc')};
  }
`

function FieldWrapper(props: ObjectFieldTemplateProps) {
  const { selectField, selectedFieldName } = useFormBuilder()

  return (
    <>
      <legend>{props.title}</legend>
      <p>{props.description}</p>
      {props.properties.map((element, i) => (
        <SelectableField
          selected={selectedFieldName === element.name}
          key={element.name}
          onClick={() => selectField(element.name)}
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
