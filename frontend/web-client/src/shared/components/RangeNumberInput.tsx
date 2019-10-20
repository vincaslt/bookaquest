import { InputNumber } from 'antd'
import { InputNumberProps } from 'antd/lib/input-number'
import * as React from 'react'

interface Props extends Omit<InputNumberProps, 'value' | 'onChange' | 'placeholder'> {
  name: string
  onChange: (value: [number?, number?]) => void
  value: [number?, number?]
  placeholder?: [string?, string?]
}

function RangeNumberInput({ name, value: [from, to], onChange, placeholder = [], ...rest }: Props) {
  const handleFromChange = (value?: number) => onChange([value, to])
  const handleToChange = (value?: number) => onChange([from, value])

  return (
    <div className="flex">
      <InputNumber
        name={`${name}_from`}
        {...rest}
        placeholder={placeholder[0]}
        value={from}
        onChange={handleFromChange}
        className="mr-2"
      />
      <InputNumber
        name={`${name}_to`}
        {...rest}
        placeholder={placeholder[1]}
        value={to}
        onChange={handleToChange}
      />
    </div>
  )
}

export default RangeNumberInput
