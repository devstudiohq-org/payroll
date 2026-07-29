import type { EmployeeDto, UpdateEmployeeInput } from '@starter/types';
import { employees, type CreateEmployeeInput, type Employee } from '@starter/db';
import { and, asc, eq } from 'drizzle-orm';

import type { Database } from '../lib/db';

function toEmployeeDto(employee: Employee): EmployeeDto {
  return {
    id: employee.id,
    companyId: employee.companyId,
    name: employee.name,
    role: employee.role,
    email: employee.email,
    trn: employee.trn,
    nis: employee.nis,
    salary: Number(employee.salary),
    status: employee.status,
    employmentType: employee.employmentType,
    startDate: employee.startDate ? employee.startDate : null,
    deductions: employee.deductions ?? [],
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}

export async function listEmployees(db: Database, companyId: string): Promise<EmployeeDto[]> {
  const rows = await db
    .select()
    .from(employees)
    .where(eq(employees.companyId, companyId))
    .orderBy(asc(employees.createdAt));

  return rows.map(toEmployeeDto);
}

export async function createEmployee(
  db: Database,
  companyId: string,
  input: CreateEmployeeInput,
): Promise<EmployeeDto> {
  const [employee] = await db
    .insert(employees)
    .values({
      companyId,
      name: input.name,
      role: input.role,
      email: input.email ? input.email : null,
      trn: input.trn,
      nis: input.nis,
      salary: input.salary.toFixed(2),
      status: input.status,
      employmentType: input.employmentType ?? 'Full-time',
      startDate: input.startDate ? input.startDate : null,
      deductions: input.deductions ?? [],
    })
    .returning();

  if (!employee) {
    throw new Error('Failed to create employee');
  }

  return toEmployeeDto(employee);
}

export async function updateEmployee(
  db: Database,
  companyId: string,
  employeeId: string,
  input: UpdateEmployeeInput,
): Promise<EmployeeDto | null> {
  const updateData: Partial<typeof employees.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.role !== undefined) updateData.role = input.role;
  if (input.email !== undefined) updateData.email = input.email || null;
  if (input.trn !== undefined) updateData.trn = input.trn;
  if (input.nis !== undefined) updateData.nis = input.nis;
  if (input.salary !== undefined) updateData.salary = input.salary.toFixed(2);
  if (input.status !== undefined) updateData.status = input.status;
  if (input.employmentType !== undefined) updateData.employmentType = input.employmentType;
  if (input.startDate !== undefined) updateData.startDate = input.startDate || null;
  if (input.deductions !== undefined) updateData.deductions = input.deductions;

  const [updated] = await db
    .update(employees)
    .set(updateData)
    .where(and(eq(employees.id, employeeId), eq(employees.companyId, companyId)))
    .returning();

  if (!updated) return null;

  return toEmployeeDto(updated);
}
