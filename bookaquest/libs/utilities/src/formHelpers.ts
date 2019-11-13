import { RadioChangeEvent } from 'antd/lib/radio';

export function asOption<T extends string, E extends HTMLInputElement>(
  handler: (value: T) => void
) {
  return (e: RadioChangeEvent | React.ChangeEvent<E>) =>
    handler(e.target.value as T);
}

export function asString<E extends HTMLInputElement | HTMLTextAreaElement>(
  handler: (value: string) => void
) {
  return (e: React.ChangeEvent<E>) => handler(e.currentTarget.value);
}

export function asNumber<E extends HTMLInputElement | HTMLTextAreaElement>(
  handler: (value: number) => void
) {
  return (e: React.ChangeEvent<E>) => handler(+e.currentTarget.value);
}
