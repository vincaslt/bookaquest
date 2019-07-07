import { Input, Select } from 'antd'
import * as React from 'react'
import { useFormBuilder } from '../FormBuilderProvider'

function FieldDefinition() {
  const { selectedField, selectedFieldName, changeFieldProperty } = useFormBuilder()

  if (!selectedField) {
    return null
  }

  const handleChangeProperty = (key: string) => (value: any) => changeFieldProperty(key, value)

  function asString<E extends HTMLInputElement>(handler: (value: string) => void) {
    return (e: React.ChangeEvent<E>) => handler(e.currentTarget.value)
  }

  function asNumber<E extends HTMLInputElement>(handler: (value: number) => void) {
    return (e: React.ChangeEvent<E>) => handler(+e.currentTarget.value)
  }

  return (
    <div>
      <h6>Properties</h6>
      <div>Field: {selectedFieldName}</div>

      <div>
        <label>Type</label>
        <Select value={selectedField.type} onChange={handleChangeProperty('type')}>
          <Select.Option value="string">String</Select.Option>
          <Select.Option value="integer">Integer</Select.Option>
        </Select>
      </div>

      <div>
        <label>Label</label>
        <Input onChange={asString(handleChangeProperty('title'))} value={selectedField.title} />
      </div>
      {selectedField.type === 'string' && (
        <div>
          <label>Default value</label>
          <Input
            onChange={asString(handleChangeProperty('default'))}
            value={selectedField.default as string}
          />
        </div>
      )}
      {selectedField.type === 'integer' && (
        <div>
          <label>Default value</label>
          <Input
            onChange={asNumber(handleChangeProperty('default'))}
            value={selectedField.default as number}
          />
        </div>
      )}
    </div>
  )
}

export default FieldDefinition
