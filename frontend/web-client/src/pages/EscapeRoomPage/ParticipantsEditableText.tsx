import { Tooltip } from 'antd'
import Text, { TextProps } from 'antd/lib/typography/Text'
import * as React from 'react'
import { useI18n } from '~/../commons/utils/i18n'
import EditButton from '../../shared/components/EditButton'
import RangeNumberInput from '../../shared/components/RangeNumberInput'

interface Props extends Omit<TextProps, 'editable' | 'children'> {
  participants: [number?, number?]
  onChange: (value: [number?, number?]) => void
}

function ParticipantsEditableText({ onChange, className = '', participants, ...rest }: Props) {
  const { t } = useI18n()
  const [editing, setEditing] = React.useState(false)
  const [value, setValue] = React.useState(participants)
  const [min, max] = participants

  const handleBlur = () => {
    if (value[0] !== min || value[1] !== max) {
      onChange(value)
    }
    setEditing(false)
  }

  return editing ? (
    <RangeNumberInput
      min={0}
      name="participants"
      value={value}
      onChange={setValue}
      onBlur={handleBlur}
      placeholder={[t`From`, t`To`]}
      autoFocus
    />
  ) : (
    <Text {...rest} className={`inline-flex items-center ${className}`}>
      {min} - {max}
      <Tooltip title={t`Edit`}>
        <EditButton onClick={() => setEditing(true)} />
      </Tooltip>
    </Text>
  )
}

export default ParticipantsEditableText
