import type { EmployeeDto, PayAdjustment, PayslipLine, TaxConfigDto } from './index';

export interface Deductions {
  grossPay: number;
  taxablePay: number;
  incomeTax: number;
  nisDeduction: number;
  nhtDeduction: number;
  edtaxDeduction: number;
  totalDeductions: number;
  netPay: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumAdjustments(items: PayAdjustment[]): number {
  return items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
}

interface Statutory {
  nisDeduction: number;
  nhtDeduction: number;
  edtaxDeduction: number;
  incomeTax: number;
  taxablePay: number;
}

/**
 * Core statutory calculation (Jamaican model).
 *
 * - NIS and NHT are a flat percentage of gross.
 * - Chargeable income = gross − NIS − pre-tax deductions (e.g. approved pension).
 *   Education Tax is charged on it, and PAYE on the amount above the tax-free
 *   threshold (with a high-earner band above the high-earner threshold).
 */
function computeStatutory(gross: number, preTaxDeductions: number, config: TaxConfigDto): Statutory {
  const nisDeduction = gross * (config.nisRate / 100);
  const nhtDeduction = gross * (config.nhtRate / 100);

  const chargeable = Math.max(0, gross - nisDeduction - Math.max(0, preTaxDeductions));
  const edtaxDeduction = chargeable * (config.edtaxRate / 100);
  const taxablePay = Math.max(0, chargeable - config.taxFreeThreshold);

  let incomeTax: number;
  const hasHighBand =
    config.highEarnerThreshold > config.taxFreeThreshold && chargeable > config.highEarnerThreshold;

  if (hasHighBand) {
    const standardBand = config.highEarnerThreshold - config.taxFreeThreshold;
    const highBand = chargeable - config.highEarnerThreshold;
    incomeTax =
      standardBand * (config.standardTaxRate / 100) + highBand * (config.highEarnerTaxRate / 100);
  } else {
    incomeTax = taxablePay * (config.standardTaxRate / 100);
  }

  return { nisDeduction, nhtDeduction, edtaxDeduction, incomeTax, taxablePay };
}

/** Compute an employee's statutory deductions for a given monthly gross. */
export function computeDeductions(grossPay: number, config: TaxConfigDto): Deductions {
  const gross = Math.max(0, grossPay);
  const s = computeStatutory(gross, 0, config);
  const totalDeductions = s.nisDeduction + s.nhtDeduction + s.edtaxDeduction + s.incomeTax;

  return {
    grossPay: round2(gross),
    taxablePay: round2(s.taxablePay),
    incomeTax: round2(s.incomeTax),
    nisDeduction: round2(s.nisDeduction),
    nhtDeduction: round2(s.nhtDeduction),
    edtaxDeduction: round2(s.edtaxDeduction),
    totalDeductions: round2(totalDeductions),
    netPay: round2(gross - totalDeductions),
  };
}

export interface PayslipIdentity {
  employeeId: string;
  name: string;
  role: string;
  trn: string;
  nis: string;
}

/**
 * Compute a full payslip line from a base salary plus per-employee adjustments.
 * Additions (e.g. overtime) are taxable and increase gross; custom deductions
 * (e.g. pension, insurance) are pre-tax — they reduce the Education Tax and PAYE
 * base and are then subtracted from net pay.
 */
export function computePayslipLine(
  identity: PayslipIdentity,
  baseGross: number,
  additions: PayAdjustment[],
  customDeductions: PayAdjustment[],
  config: TaxConfigDto,
): PayslipLine {
  const base = Math.max(0, baseGross);
  const grossPay = base + sumAdjustments(additions);
  const customDeductionsTotal = round2(sumAdjustments(customDeductions));

  const s = computeStatutory(grossPay, customDeductionsTotal, config);
  const totalDeductions = round2(
    s.nisDeduction + s.nhtDeduction + s.edtaxDeduction + s.incomeTax + customDeductionsTotal,
  );

  return {
    employeeId: identity.employeeId,
    name: identity.name,
    role: identity.role,
    trn: identity.trn,
    nis: identity.nis,
    baseGross: round2(base),
    additions,
    customDeductions,
    grossPay: round2(grossPay),
    taxablePay: round2(s.taxablePay),
    incomeTax: round2(s.incomeTax),
    nisDeduction: round2(s.nisDeduction),
    nhtDeduction: round2(s.nhtDeduction),
    edtaxDeduction: round2(s.edtaxDeduction),
    customDeductionsTotal,
    totalDeductions,
    netPay: round2(grossPay - totalDeductions),
  };
}

/** Build a payslip line for an employee using their salary as monthly gross, no adjustments. */
export function buildPayslipLine(employee: EmployeeDto, config: TaxConfigDto): PayslipLine {
  return computePayslipLine(
    {
      employeeId: employee.id,
      name: employee.name,
      role: employee.role,
      trn: employee.trn,
      nis: employee.nis,
    },
    employee.salary,
    [],
    [],
    config,
  );
}
