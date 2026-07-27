import 'dotenv/config';

import { and, eq } from 'drizzle-orm';
import {
  createDatabaseClient,
  employees,
  payrollRuns,
  payslipItems,
  taxConfigurations,
  type Employee,
} from '@starter/db';
import { buildPayslipLine, type EmployeeDto, type PayslipLine, type TaxConfigDto } from '@starter/types';

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

function toValues(line: PayslipLine) {
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

async function loadConfig(
  db: ReturnType<typeof createDatabaseClient>['db'],
  companyId: string,
): Promise<TaxConfigDto> {
  const [row] = await db
    .select()
    .from(taxConfigurations)
    .where(eq(taxConfigurations.companyId, companyId))
    .limit(1);

  const zero = {
    companyId,
    taxFreeThreshold: 0,
    nisRate: 0,
    nhtRate: 0,
    edtaxRate: 0,
    standardTaxRate: 0,
    highEarnerThreshold: 0,
    highEarnerTaxRate: 0,
    isDefault: true,
    updatedAt: null,
  } satisfies TaxConfigDto;

  if (!row) return zero;

  return {
    companyId,
    taxFreeThreshold: Number(row.taxFreeThreshold),
    nisRate: Number(row.nisRate),
    nhtRate: Number(row.nhtRate),
    edtaxRate: Number(row.edtaxRate),
    standardTaxRate: Number(row.standardTaxRate),
    highEarnerThreshold: Number(row.highEarnerThreshold),
    highEarnerTaxRate: Number(row.highEarnerTaxRate),
    isDefault: false,
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function main() {
  const { db, pool } = createDatabaseClient();

  try {
    const runs = await db.select().from(payrollRuns);
    let backfilled = 0;

    for (const run of runs) {
      const existing = await db
        .select({ id: payslipItems.id })
        .from(payslipItems)
        .where(eq(payslipItems.payrollRunId, run.id))
        .limit(1);

      if (existing.length > 0) continue;

      const active = await db
        .select()
        .from(employees)
        .where(and(eq(employees.companyId, run.companyId), eq(employees.status, 'Active')));

      const config = await loadConfig(db, run.companyId);
      const lines = active.map((employee) => buildPayslipLine(toEmployeeDto(employee), config));

      if (lines.length > 0) {
        await db.insert(payslipItems).values(
          lines.map((line) => ({
            payrollRunId: run.id,
            employeeId: line.employeeId || null,
            ...toValues(line),
          })),
        );
      }

      const totals = lines.reduce(
        (acc, line) => ({
          gross: acc.gross + line.grossPay,
          net: acc.net + line.netPay,
          tax: acc.tax + line.incomeTax,
          nis: acc.nis + line.nisDeduction,
        }),
        { gross: 0, net: 0, tax: 0, nis: 0 },
      );

      await db
        .update(payrollRuns)
        .set({
          employeesCount: lines.length,
          totalGrossPay: totals.gross.toFixed(2),
          totalNetPay: totals.net.toFixed(2),
          totalTax: totals.tax.toFixed(2),
          totalNis: totals.nis.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(payrollRuns.id, run.id));

      backfilled += 1;
      console.log(`Backfilled run #${run.runNumber} (${run.period}) with ${lines.length} payslips`);
    }

    console.log(`Backfill complete — ${backfilled} run(s) updated`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
