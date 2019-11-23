export function classNames(...strings: (string | undefined | null)[]) {
  return strings.filter(Boolean).join(' ');
}
