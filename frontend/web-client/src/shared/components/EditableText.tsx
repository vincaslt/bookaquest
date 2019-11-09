import { Input, Tooltip } from 'antd'
import { InputProps } from 'antd/lib/input'
import Text, { TextProps } from 'antd/lib/typography/Text'
import * as React from 'react'
import { useToggle } from 'react-use'
import { useI18n } from '~/../commons/utils/i18n'
import EditButton from './EditButton'

interface Props extends Omit<TextProps, 'editable' | 'children'> {
  children?: string | number
  onChange?: (value: string) => void
  multiline?: boolean
  inputProps?: InputProps
}

function EditableText({ onChange, multiline, children, className, inputProps, ...rest }: Props) {
  const { t } = useI18n()
  const [value, setValue] = React.useState(children)
  const [editing, toggleEdit] = useToggle(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue(e.target.value)

  const handleBlur = () => {
    if (onChange && value) {
      onChange(String(value))
    }
    toggleEdit(false)
  }

  return editing ? (
    multiline ? (
      <Input.TextArea
        rows={1}
        autoFocus
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
      />
    ) : (
      <Input autoFocus onChange={handleChange} onBlur={handleBlur} value={value} {...inputProps} />
    )
  ) : (
    <Text {...rest} className={`inline-flex items-center ${className}`}>
      {children}
      <Tooltip title={t`Edit`}>
        <EditButton onClick={toggleEdit} />
      </Tooltip>
    </Text>
  )
}

export default EditableText
