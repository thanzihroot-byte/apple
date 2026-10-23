/** Format a rupee amount using Indian digit grouping (1,29,900). */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** Format without the rupee symbol — used where the symbol is rendered separately. */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

/** Compact rupee notation for price brackets (₹25k, ₹1.5L). */
export function formatCompactINR(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}k`;
  }
  return `₹${amount}`;
}

export function formatEMI(monthly: number): string {
  return `₹${monthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
