import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createCompany,
  fetchCompanies,
  fetchDashboard,
  fetchEmployees,
  resolveApiBaseUrl,
} from './index';

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

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe('company + employee client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps the companies array from the response envelope', async () => {
    const companies = [{ id: 'c1', name: 'Acme' }];
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ companies }));

    const result = await fetchCompanies();

    expect(fetch).toHaveBeenCalledWith('/api/companies');
    expect(result).toEqual(companies);
  });

  it('posts the payload and returns the created company', async () => {
    const company = { id: 'c2', name: 'TechNova' };
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ company }, true, 201));

    const input = {
      name: 'TechNova',
      industry: 'Technology',
      employeeCount: 10,
      address: '1 Road',
      trn: '100',
      nis: 'NIS-1',
      email: 'a@b.com',
      members: [],
    };
    const result = await createCompany(input);

    expect(fetch).toHaveBeenCalledWith(
      '/api/companies',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toEqual(company);
  });

  it('scopes employees to a company id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ employees: [] }));

    await fetchEmployees('company-9');

    expect(fetch).toHaveBeenCalledWith('/api/companies/company-9/employees');
  });

  it('throws a readable error built from the API error body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Invalid request', issues: ['Company name is required'] } }, false, 400),
    );

    await expect(fetchCompanies()).rejects.toThrow('Invalid request: Company name is required');
  });
});
