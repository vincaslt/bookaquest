declare module 'tzjs' {
  export function getOffset(timezone: string, date: Date): number;
  export function fmt(options: Intl.DateTimeFormatOptions, locale?: string): string
  export function toDate(date: Date | string | number): Date
}