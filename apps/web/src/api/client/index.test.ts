import { describe, expect, it } from 'vitest';

import { fetchDashboard, resolveApiBaseUrl } from './index';

describe('resolveApiBaseUrl', () => {
  it('falls back to the local api prefix when no env var is set', () => {
    expect(resolveApiBaseUrl()).toBe('/api');
  });
});

describe('fetchDashboard', () => {
  it('resolves to a blank dashboard until the database is connected', async () => {
    const data = await fetchDashboard();

    expect(data.stats.activeEmployees).toBeNull();
    expect(data.stats.monthlyPayrollCost).toBeNull();
    expect(data.stats.payrollRunsTotal).toBeNull();
    expect(data.currentPayRun.status).toBeNull();
    expect(data.currentPayRun.netPay).toBeNull();
    expect(data.todoTasks).toEqual([]);
  });

  it('keeps the cost summary categories with blank values', () => {
    return fetchDashboard().then((data) => {
      expect(data.costSummary.items).toHaveLength(4);
      expect(data.costSummary.items.map((item) => item.label)).toEqual([
        'Net Pay',
        'Taxes',
        'Benefits',
        'Deductions',
      ]);
      expect(data.costSummary.items.every((item) => item.value === null)).toBe(true);
    });
  });
});
