// Universal currency formatter using Intl API
// Usage: universalCurrency(amount, currencyCode)
export default function universalCurrency(amount, currency = 'NGN', locale = 'en-NG') {
  if (typeof amount !== 'number') amount = Number(amount);
  if (isNaN(amount)) return `${currency} 0`;
  return amount.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
