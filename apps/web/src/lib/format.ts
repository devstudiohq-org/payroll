const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats an ISO date (YYYY-MM-DD) as e.g. "Jan 30, 2026". */
export function formatLongDate(isoDate: string): string {
  return longDateFormatter.format(new Date(isoDate));
}

/** Formats an ISO date (YYYY-MM-DD) as "YYYY/MM/DD". */
export function formatSlashDate(isoDate: string): string {
  return isoDate.split('-').join('/');
}
