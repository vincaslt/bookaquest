import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import * as React from 'react';

interface Props
  extends Omit<
    InputNumberProps,
    'value' | 'onChange' | 'placeholder' | 'onBlur'
  > {
  name: string;
  onChange: (value: [number?, number?]) => void;
  onBlur: () => void;
  value: [number?, number?];
  placeholder?: [string?, string?];
}

export function RangeNumberInput({
  name,
  value: [from, to],
  onBlur,
  onChange,
  placeholder = [],
  autoFocus,
  ...rest
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleFromChange = (value?: number) => onChange([value, to]);
  const handleToChange = (value?: number) => onChange([from, value]);

  return (
    <div
      className="flex"
      ref={containerRef}
      onBlur={e => {
        if (
          onBlur &&
          !containerRef.current?.contains(e.relatedTarget as Node | null)
        ) {
          onBlur();
        }
      }}
    >
      <InputNumber
        name={`${name}_from`}
        {...rest}
        placeholder={placeholder[0]}
        value={from}
        onChange={handleFromChange}
        className="mr-2"
        autoFocus={autoFocus}
      />
      <InputNumber
        name={`${name}_to`}
        {...rest}
        placeholder={placeholder[1]}
        value={to}
        onChange={handleToChange}
      />
    </div>
  );
}
