export function asString<E extends HTMLInputElement>(handler: (value: string) => void) {
  return (e: React.ChangeEvent<E>) => handler(e.currentTarget.value)
}

export function asNumber<E extends HTMLInputElement>(handler: (value: number) => void) {
  return (e: React.ChangeEvent<E>) => handler(+e.currentTarget.value)
}
