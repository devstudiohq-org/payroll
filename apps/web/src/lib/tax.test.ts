import { describe, expect, it } from 'vitest';
import type { TaxConfigDto } from '@starter/types';
import { computePayslipLine } from '@starter/types';

import { computeDeductions } from './tax';

const config: TaxConfigDto = {
  companyId: 'c1',
  taxFreeThreshold: 100_000,
  nisRate: 3,
  nhtRate: 2,
  edtaxRate: 2.25,
  standardTaxRate: 25,
  highEarnerThreshold: 500_000,
  highEarnerTaxRate: 30,
  isDefault: false,
  updatedAt: null,
};

describe('computeDeductions', () => {
  it('charges statutory deductions but no PAYE at or below the threshold', () => {
    const d = computeDeductions(100_000, config);
    // NIS 3% = 3,000; statutory income = 97,000 (below 100k threshold => no PAYE)
    expect(d.incomeTax).toBe(0);
    expect(d.taxablePay).toBe(0);
    expect(d.nisDeduction).toBe(3_000);
    expect(d.nhtDeduction).toBe(2_000);
    expect(d.edtaxDeduction).toBe(2_182.5); // 2.25% of 97,000
    expect(d.totalDeductions).toBe(7_182.5);
    expect(d.netPay).toBe(92_817.5);
  });

  it('charges statutory deductions with no PAYE well below the threshold', () => {
    const d = computeDeductions(50_000, config);
    expect(d.incomeTax).toBe(0);
    expect(d.nisDeduction).toBe(1_500);
    expect(d.nhtDeduction).toBe(1_000);
    expect(d.edtaxDeduction).toBe(1_091.25); // 2.25% of 48,500
    expect(d.netPay).toBe(46_408.75);
  });

  it('taxes statutory income (gross - NIS) above the threshold at the standard rate', () => {
    const d = computeDeductions(200_000, config);
    // NIS 3% of 200k = 6k; statutory income = 194k
    expect(d.nisDeduction).toBe(6_000);
    // NHT 2% of gross = 4k; EDTAX 2.25% of statutory = 4,365
    expect(d.nhtDeduction).toBe(4_000);
    expect(d.edtaxDeduction).toBe(4_365);
    // PAYE taxable = 194k - 100k = 94k @ 25% = 23,500
    expect(d.taxablePay).toBe(94_000);
    expect(d.incomeTax).toBe(23_500);
    expect(d.totalDeductions).toBe(37_865);
    expect(d.netPay).toBe(162_135);
  });

  it('applies progressive bands above the high-earner threshold (on statutory income)', () => {
    const d = computeDeductions(600_000, config);
    // NIS 18k -> statutory 582k
    // standard band: 500k - 100k = 400k @ 25% = 100k
    // high band: 582k - 500k = 82k @ 30% = 24.6k
    expect(d.incomeTax).toBe(124_600);
  });

  it('falls back to the standard rate when no high-earner band applies', () => {
    const noBand: TaxConfigDto = { ...config, highEarnerThreshold: 0 };
    const d = computeDeductions(600_000, noBand);
    // statutory 582k, taxable = 582k - 100k = 482k @ 25% = 120,500
    expect(d.incomeTax).toBe(120_500);
  });

  it('produces zero deductions for an all-zero config', () => {
    const zero: TaxConfigDto = {
      ...config,
      taxFreeThreshold: 0,
      nisRate: 0,
      nhtRate: 0,
      edtaxRate: 0,
      standardTaxRate: 0,
      highEarnerThreshold: 0,
      highEarnerTaxRate: 0,
    };
    const d = computeDeductions(200_000, zero);
    expect(d.totalDeductions).toBe(0);
    expect(d.netPay).toBe(200_000);
  });
});

const identity = { employeeId: 'e1', name: 'A', role: 'R', trn: 'T', nis: 'N' };

describe('computePayslipLine', () => {
  it('taxes additions and treats custom deductions as pre-tax', () => {
    const line = computePayslipLine(
      identity,
      200_000,
      [{ label: 'Overtime', amount: 50_000 }],
      [{ label: 'Pension', amount: 10_000 }],
      config,
    );

    // gross = 250k; NIS 7,500; gross - NIS = 242,500
    // pre-tax pension 10,000 => chargeable = 232,500
    expect(line.baseGross).toBe(200_000);
    expect(line.grossPay).toBe(250_000);
    expect(line.nisDeduction).toBe(7_500);
    expect(line.edtaxDeduction).toBe(5_231.25); // 2.25% of 232,500
    expect(line.incomeTax).toBe(33_125); // (232,500 - 100,000) @ 25%
    expect(line.customDeductionsTotal).toBe(10_000);
    expect(line.totalDeductions).toBe(60_856.25);
    expect(line.netPay).toBe(189_143.75);
  });

  it('matches plain statutory deductions when there are no adjustments', () => {
    const line = computePayslipLine(identity, 200_000, [], [], config);
    const d = computeDeductions(200_000, config);
    expect(line.netPay).toBe(d.netPay);
    expect(line.totalDeductions).toBe(d.totalDeductions);
    expect(line.customDeductionsTotal).toBe(0);
  });
});
