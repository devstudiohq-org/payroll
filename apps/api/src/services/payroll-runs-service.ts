import type { EmployeeDto, PayrollRunDto, PayslipLine } from '@starter/types';
import { buildPayslipLine, computePayslipLine } from '@starter/types';
import {
  employees,
  payrollRuns,
  payslipItems,
  type CreatePayrollRunInput,
  type Employee,
  type PayslipItem,
  type PayrollRun,
  type UpdatePayslipInput,
} from '@starter/db';
import { and, asc, eq } from 'drizzle-orm';

import type { Database } from '../lib/db';
import { getTaxConfig } from './tax-config-service';

/** Convert a computed payslip line to the numeric-as-string shape the table stores. */
function toPayslipValues(line: PayslipLine) {
  return {
    name: line.name,
    role: line.role,
    trn: line.trn,
    nis: line.nis,
    baseGross: line.baseGross.toFixed(2),
    additions: line.additions,
    customDeductions: line.customDeductions,
    grossPay: line.grossPay.toFixed(2),
    taxablePay: line.taxablePay.toFixed(2),
    incomeTax: line.incomeTax.toFixed(2),
    nisDeduction: line.nisDeduction.toFixed(2),
    nhtDeduction: line.nhtDeduction.toFixed(2),
    edtaxDeduction: line.edtaxDeduction.toFixed(2),
    customDeductionsTotal: line.customDeductionsTotal.toFixed(2),
    totalDeductions: line.totalDeductions.toFixed(2),
    netPay: line.netPay.toFixed(2),
  };
}

function toPayslipLine(row: PayslipItem): PayslipLine {
  return {
    id: row.id,
    employeeId: row.employeeId ?? '',
    name: row.name,
    role: row.role,
    trn: row.trn,
    nis: row.nis,
    baseGross: Number(row.baseGross),
    additions: row.additions,
    customDeductions: row.customDeductions,
    grossPay: Number(row.grossPay),
    taxablePay: Number(row.taxablePay),
    incomeTax: Number(row.incomeTax),
    nisDeduction: Number(row.nisDeduction),
    nhtDeduction: Number(row.nhtDeduction),
    edtaxDeduction: Number(row.edtaxDeduction),
    customDeductionsTotal: Number(row.customDeductionsTotal),
    totalDeductions: Number(row.totalDeductions),
    netPay: Number(row.netPay),
  };
}

function toPayrollRunDto(run: PayrollRun): PayrollRunDto {
  return {
    id: run.id,
    runNumber: run.runNumber,
    companyId: run.companyId,
    period: run.period,
    employeesCount: run.employeesCount,
    totalGrossPay: Number(run.totalGrossPay),
    totalNetPay: Number(run.totalNetPay),
    totalTax: Number(run.totalTax),
    totalNis: Number(run.totalNis),
    status: run.status as 'Completed' | 'Pending' | 'Processing',
    completedAt: run.completedAt.toISOString(),
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
  };
}

function toEmployeeDto(row: Employee): EmployeeDto {
  return {
    id: row.id,
    companyId: row.companyId,
    name: row.name,
    role: row.role,
    email: row.email,
    trn: row.trn,
    nis: row.nis,
    salary: Number(row.salary),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listPayrollRuns(db: Database, companyId: string): Promise<PayrollRunDto[]> {
  const rows = await db
    .select()
    .from(payrollRuns)
    .where(eq(payrollRuns.companyId, companyId))
    .orderBy(asc(payrollRuns.runNumber));

  return rows.map(toPayrollRunDto);
}

/**
 * Create a payroll run. Totals and a per-employee payslip snapshot are computed
 * from the company's active employees and its tax configuration, then stored so
 * payslips can later be generated from the run itself.
 */
export async function createPayrollRun(
  db: Database,
  companyId: string,
  input: CreatePayrollRunInput,
): Promise<PayrollRunDto> {
  const config = await getTaxConfig(db, companyId);

  const activeEmployees = await db
    .select()
    .from(employees)
    .where(and(eq(employees.companyId, companyId), eq(employees.status, 'Active')))
    .orderBy(asc(employees.createdAt));

  const lines: PayslipLine[] = activeEmployees.map((employee) =>
    buildPayslipLine(toEmployeeDto(employee), config),
  );

  const totals = lines.reduce(
    (acc, line) => ({
      gross: acc.gross + line.grossPay,
      net: acc.net + line.netPay,
      tax: acc.tax + line.incomeTax,
      nis: acc.nis + line.nisDeduction,
    }),
    { gross: 0, net: 0, tax: 0, nis: 0 },
  );

  return db.transaction(async (tx) => {
    const [run] = await tx
      .insert(payrollRuns)
      .values({
        companyId,
        period: input.period,
        employeesCount: lines.length,
        totalGrossPay: totals.gross.toFixed(2),
        totalNetPay: totals.net.toFixed(2),
        totalTax: totals.tax.toFixed(2),
        totalNis: totals.nis.toFixed(2),
        status: input.status ?? 'Completed',
      })
      .returning();

    if (!run) {
      throw new Error('Failed to create payroll run');
    }

    if (lines.length > 0) {
      await tx.insert(payslipItems).values(
        lines.map((line) => ({
          payrollRunId: run.id,
          employeeId: line.employeeId || null,
          ...toPayslipValues(line),
        })),
      );
    }

    return toPayrollRunDto(run);
  });
}

/** Fetch the stored per-employee payslip lines for a run. */
export async function listPayslipLines(db: Database, runId: string): Promise<PayslipLine[]> {
  const rows = await db
    .select()
    .from(payslipItems)
    .where(eq(payslipItems.payrollRunId, runId))
    .orderBy(asc(payslipItems.createdAt));

  return rows.map(toPayslipLine);
}

/**
 * Update a payslip line's additions and custom deductions, recomputing all
 * statutory figures and totals from the stored base salary and the company's
 * current tax configuration.
 */
export async function updatePayslipItem(
  db: Database,
  runId: string,
  payslipId: string,
  input: UpdatePayslipInput,
): Promise<PayslipLine | null> {
  const [item] = await db
    .select()
    .from(payslipItems)
    .where(and(eq(payslipItems.id, payslipId), eq(payslipItems.payrollRunId, runId)))
    .limit(1);

  if (!item) {
    return null;
  }

  const [run] = await db
    .select({ companyId: payrollRuns.companyId })
    .from(payrollRuns)
    .where(eq(payrollRuns.id, item.payrollRunId))
    .limit(1);

  if (!run) {
    return null;
  }

  const config = await getTaxConfig(db, run.companyId);
  const recomputed = computePayslipLine(
    {
      employeeId: item.employeeId ?? '',
      name: item.name,
      role: item.role,
      trn: item.trn,
      nis: item.nis,
    },
    Number(item.baseGross),
    input.additions,
    input.customDeductions,
    config,
  );

  const [updated] = await db
    .update(payslipItems)
    .set(toPayslipValues(recomputed))
    .where(eq(payslipItems.id, payslipId))
    .returning();

  return updated ? toPayslipLine(updated) : null;
}
