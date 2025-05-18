// Format a number as Naira currency
export default function formatCurrency(amount) {
  if (typeof amount !== 'number') amount = Number(amount);
  if (isNaN(amount)) return '₦0';
  return `₦${amount.toLocaleString()}`;
}
