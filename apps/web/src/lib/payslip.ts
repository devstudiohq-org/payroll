import type { CompanyDto, PayrollRunDto, PayslipLine } from '@starter/types';

/** Year-to-date running totals shown at the bottom of a payslip. */
export interface PayslipYtd {
  taxGross: number;
  edtax: number;
  nht: number;
  nis: number;
  paye: number;
}

export interface PayslipEntry {
  line: PayslipLine;
  ytd: PayslipYtd;
}

export interface PayslipDocument {
  companyName: string;
  periodEnding: string;
  runDate: string;
  cycle: number;
  entries: PayslipEntry[];
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Build the payslip document for a run from its stored per-employee lines.
 *
 * Year-to-date figures are approximated as the current period's amount times the
 * cycle number (run number), which is exact while pay is unchanged across the year.
 */
export function buildPayslipDocument(
  company: CompanyDto,
  run: PayrollRunDto,
  lines: PayslipLine[],
): PayslipDocument {
  const cycle = run.runNumber;

  const entries: PayslipEntry[] = lines.map((line) => ({
    line,
    ytd: {
      taxGross: round2(line.grossPay * cycle),
      edtax: round2(line.edtaxDeduction * cycle),
      nht: round2(line.nhtDeduction * cycle),
      nis: round2(line.nisDeduction * cycle),
      paye: round2(line.incomeTax * cycle),
    },
  }));

  return {
    companyName: company.name,
    periodEnding: run.period,
    runDate: new Date(run.completedAt).toLocaleDateString('en-GB'),
    cycle,
    entries,
  };
}
