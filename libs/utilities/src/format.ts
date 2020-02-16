export function formatCurrency(
  locale: string,
  currency: string,
  number: number
) {
  return new Intl.NumberFormat(locale, { currency, style: 'currency' }).format(
    number
  );
}
