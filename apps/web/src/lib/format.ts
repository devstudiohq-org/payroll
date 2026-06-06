const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Formats a number as USD currency. Returns "" for blank (null/undefined) values. */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '';
  return currencyFormatter.format(value);
}

/** Renders a numeric value as text, or "" when blank. */
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '';
  return String(value);
}

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats an ISO date (YYYY-MM-DD) as e.g. "Jan 30, 2026". Returns "" when blank. */
export function formatLongDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  return longDateFormatter.format(new Date(isoDate));
}

/** Formats an ISO date (YYYY-MM-DD) as "YYYY/MM/DD". Returns "" when blank. */
export function formatSlashDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  return isoDate.split('-').join('/');
}
