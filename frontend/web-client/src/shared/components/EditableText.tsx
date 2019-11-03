import { Icon, Input, Tooltip, Typography } from 'antd'
import { InputProps } from 'antd/lib/input'
import { TextProps } from 'antd/lib/typography/Text'
import * as React from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import { useI18n } from '~/../commons/utils/i18n'

const { Text } = Typography

const EditButton = styled.div`
  border: 0px;
  background: transparent;
  padding: 0px;
  line-height: inherit;
  display: inline-flex;
`

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
        <EditButton
          role="button"
          className="ant-typography-edit"
          aria-label="Edit"
          onClick={toggleEdit}
        >
          <Icon type="edit" />
        </EditButton>
      </Tooltip>
    </Text>
  )
}

export default EditableText
