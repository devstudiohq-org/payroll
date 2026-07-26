import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';

import * as schema from '@starter/db/schema';

type Db = NodePgDatabase<typeof schema>;

export type EmployeeInput = {
  name: string;
  email?: string;
  startDate?: string;
  role?: string;
  department?: string;
  trn?: string;
  nis?: string;
  salary?: string;
  taxCode?: string;
  status?: string;
  allowances?: { name: string; amount: number }[];
  deductions?: { name: string; amount: number }[];
};

export async function listEmployees(db: Db) {
  return db
    .select()
    .from(schema.employees)
    .orderBy(desc(schema.employees.createdAt));
}

export async function getEmployee(db: Db, id: number) {
  const rows = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, id));

  return rows[0] ?? null;
}

export async function createEmployee(db: Db, data: EmployeeInput) {
  const rows = await db
    .insert(schema.employees)
    .values({
      name: data.name,
      email: data.email ?? '',
      startDate: data.startDate ?? '',
      role: data.role ?? '',
      department: data.department ?? '',
      trn: data.trn ?? '',
      nis: data.nis ?? '',
      salary: data.salary ?? '0',
      taxCode: data.taxCode ?? 'TC01',
      status: data.status ?? 'Active',
      allowances: data.allowances ?? [],
      deductions: data.deductions ?? [],
    })
    .returning();

  return rows[0]!;
}

export async function createEmployeesBulk(db: Db, batch: EmployeeInput[]) {
  if (batch.length === 0) return [];

  const values = batch.map((data) => ({
    name: data.name,
    email: data.email ?? '',
    startDate: data.startDate ?? '',
    role: data.role ?? '',
    department: data.department ?? '',
    trn: data.trn ?? '',
    nis: data.nis ?? '',
    salary: data.salary ?? '0',
    taxCode: data.taxCode ?? 'TC01',
    status: data.status ?? 'Active',
    allowances: data.allowances ?? [],
    deductions: data.deductions ?? [],
  }));

  return db.insert(schema.employees).values(values).returning();
}

export async function updateEmployee(db: Db, id: number, data: Partial<EmployeeInput>) {
  const update: Record<string, unknown> = {};

  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.startDate !== undefined) update.startDate = data.startDate;
  if (data.role !== undefined) update.role = data.role;
  if (data.department !== undefined) update.department = data.department;
  if (data.trn !== undefined) update.trn = data.trn;
  if (data.nis !== undefined) update.nis = data.nis;
  if (data.salary !== undefined) update.salary = data.salary;
  if (data.taxCode !== undefined) update.taxCode = data.taxCode;
  if (data.status !== undefined) update.status = data.status;
  if (data.allowances !== undefined) update.allowances = data.allowances;
  if (data.deductions !== undefined) update.deductions = data.deductions;

  const rows = await db
    .update(schema.employees)
    .set(update)
    .where(eq(schema.employees.id, id))
    .returning();

  return rows[0] ?? null;
}

export async function deleteEmployee(db: Db, id: number) {
  const rows = await db
    .delete(schema.employees)
    .where(eq(schema.employees.id, id))
    .returning();

  return rows[0] ?? null;
}
