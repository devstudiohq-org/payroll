import type { EmployeeDto } from '@starter/types';
import { employees, type CreateEmployeeInput, type Employee } from '@starter/db';
import { asc, eq } from 'drizzle-orm';

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
    })
    .returning();

  if (!employee) {
    throw new Error('Failed to create employee');
  }

  return toEmployeeDto(employee);
}
