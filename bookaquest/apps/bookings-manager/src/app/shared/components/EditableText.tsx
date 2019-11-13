import { Input, Tooltip } from 'antd';
import { InputProps } from 'antd/lib/input';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text, { TextProps } from 'antd/lib/typography/Text';
import * as React from 'react';
import { EditButton } from './EditButton';
import { useI18n, asString } from '@bookaquest/utilities';

interface Props extends Omit<TextProps, 'editable' | 'children'> {
  children?: string | number;
  onChange?: (value: string) => void;
  multiline?: boolean;
  inputProps?: InputProps;
}

export function EditableText({
  onChange,
  multiline,
  children,
  className = '',
  inputProps,
  ...rest
}: Props) {
  const { t } = useI18n();
  const [value, setValue] = React.useState(children);
  const [editing, setEditing] = React.useState(false);

  const handleBlur = () => {
    if (onChange && value && value !== children) {
      onChange(String(value));
    }
    setEditing(false);
  };

  const handleEditClick = () => {
    if (!value) {
      setValue(children);
    }
    setEditing(true);
  };

  const TextElement = multiline ? Paragraph : Text;
  const multilineText =
    typeof children === 'string'
      ? children
          .split('\n')
          .map((str, i, arr) =>
            i !== arr.length - 1 ? [str, <br key="break" />] : str
          )
      : children;

  return editing ? (
    multiline ? (
      <Input.TextArea
        rows={3}
        autoFocus
        onChange={asString(setValue)}
        onBlur={handleBlur}
        value={value}
      />
    ) : (
      <Input
        autoFocus
        onChange={asString(setValue)}
        onBlur={handleBlur}
        value={value}
        {...inputProps}
      />
    )
  ) : (
    <TextElement {...rest} className={`inline-flex items-end ${className}`}>
      {multilineText}
      <Tooltip title={t`Edit`}>
        <EditButton onClick={handleEditClick} />
      </Tooltip>
    </TextElement>
  );
}
