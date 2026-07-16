import type { PayrollRunDto } from '@starter/types';
import { payrollRuns, type PayrollRun, type CreatePayrollRunInput } from '@starter/db';
import { asc, eq } from 'drizzle-orm';

import type { Database } from '../lib/db';

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

export async function listPayrollRuns(db: Database, companyId: string): Promise<PayrollRunDto[]> {
  const rows = await db
    .select()
    .from(payrollRuns)
    .where(eq(payrollRuns.companyId, companyId))
    .orderBy(asc(payrollRuns.runNumber));

  return rows.map(toPayrollRunDto);
}

export async function createPayrollRun(
  db: Database,
  companyId: string,
  input: CreatePayrollRunInput,
): Promise<PayrollRunDto> {
  const [run] = await db
    .insert(payrollRuns)
    .values({
      companyId,
      period: input.period,
      employeesCount: input.employeesCount,
      totalGrossPay: input.totalGrossPay.toFixed(2),
      totalNetPay: input.totalNetPay.toFixed(2),
      totalTax: input.totalTax.toFixed(2),
      totalNis: input.totalNis.toFixed(2),
      status: input.status ?? 'Completed',
    })
    .returning();

  if (!run) {
    throw new Error('Failed to create payroll run');
  }

  return toPayrollRunDto(run);
}
