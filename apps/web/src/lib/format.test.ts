import { describe, expect, it } from 'vitest';

import { formatCurrency, formatLongDate, formatNumber, formatSlashDate } from './format';

describe('formatCurrency', () => {
  it('formats a number as USD currency', () => {
    expect(formatCurrency(171042.36)).toBe('$171,042.36');
  });

  it('formats zero with cents', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('returns an empty string for blank values', () => {
    expect(formatCurrency(null)).toBe('');
    expect(formatCurrency(undefined)).toBe('');
  });
});

describe('formatNumber', () => {
  it('renders a numeric value as text', () => {
    expect(formatNumber(24)).toBe('24');
  });

  it('renders zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('returns an empty string for blank values', () => {
    expect(formatNumber(null)).toBe('');
    expect(formatNumber(undefined)).toBe('');
  });
});

describe('formatLongDate', () => {
  it('formats an ISO date as a long date', () => {
    expect(formatLongDate('2026-01-30')).toBe('Jan 30, 2026');
  });

  it('returns an empty string for blank values', () => {
    expect(formatLongDate(null)).toBe('');
    expect(formatLongDate('')).toBe('');
  });
});

describe('formatSlashDate', () => {
  it('formats an ISO date with slashes', () => {
    expect(formatSlashDate('2025-09-16')).toBe('2025/09/16');
  });

  it('returns an empty string for blank values', () => {
    expect(formatSlashDate(null)).toBe('');
    expect(formatSlashDate('')).toBe('');
  });
});
