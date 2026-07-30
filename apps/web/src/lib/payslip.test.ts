import { describe, expect, it } from 'vitest';
import type { CompanyDto, PayrollRunDto, PayslipLine } from '@starter/types';

import { buildPayslipDocument } from './payslip';

const company = { id: 'c1', name: 'Acme Industries' } as CompanyDto;

const run: PayrollRunDto = {
  id: 'r1',
  runNumber: 4,
  companyId: 'c1',
  period: 'Apr 30 2026',
  employeesCount: 1,
  totalGrossPay: 200_000,
  totalNetPay: 162_135,
  totalTax: 23_500,
  totalNis: 6_000,
  status: 'Completed',
  completedAt: '2026-04-30T00:00:00.000Z',
  createdAt: '',
  updatedAt: '',
};

const line: PayslipLine = {
  id: 'p1',
  employeeId: 'e1',
  name: 'Marcus Brown',
  role: 'Manager',
  trn: '100777111',
  nis: 'NIS-1',
  baseGross: 200_000,
  additions: [],
  customDeductions: [],
  grossPay: 200_000,
  taxablePay: 94_000,
  incomeTax: 23_500,
  nisDeduction: 6_000,
  nhtDeduction: 4_000,
  edtaxDeduction: 4_365,
  customDeductionsTotal: 0,
  totalDeductions: 37_865,
  netPay: 162_135,
};

describe('buildPayslipDocument', () => {
  it('carries run metadata into the document', () => {
    const doc = buildPayslipDocument(company, run, [line]);
    expect(doc.companyName).toBe('Acme Industries');
    expect(doc.periodEnding).toBe('Apr 30 2026');
    expect(doc.cycle).toBe(4);
    expect(doc.entries).toHaveLength(1);
  });

  it('passes stored line figures through unchanged', () => {
    const { line: out } = buildPayslipDocument(company, run, [line]).entries[0]!;
    expect(out.incomeTax).toBe(23_500);
    expect(out.edtaxDeduction).toBe(4_365);
    expect(out.netPay).toBe(162_135);
  });

  it('derives year-to-date figures as current x cycle', () => {
    const { ytd } = buildPayslipDocument(company, run, [line]).entries[0]!;
    expect(ytd.taxGross).toBe(800_000); // 200k x 4
    expect(ytd.nis).toBe(24_000); // 6k x 4
    expect(ytd.paye).toBe(94_000); // 23.5k x 4
  });
});
