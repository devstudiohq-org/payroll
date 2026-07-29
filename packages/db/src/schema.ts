import { relations } from 'drizzle-orm';
import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const appMetadata = pgTable('app_metadata', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AppMetadata = typeof appMetadata.$inferSelect;
export type NewAppMetadata = typeof appMetadata.$inferInsert;

/**
 * A tenant company. Each company owns its own employees and team members and is
 * the unit the user switches between in the header / company picker.
 */
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  industry: text('industry').notNull(),
  employeeCount: integer('employee_count').notNull().default(0),
  address: text('address').notNull(),
  trn: text('trn').notNull(),
  nis: text('nis').notNull(),
  email: text('email').notNull(),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const companyMemberRole = pgEnum('company_member_role', [
  'Admin',
  'Manager',
  'Viewer',
]);

/** A person granted access to a company (the "Team Members" section of the form). */
export const companyMembers = pgTable('company_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: companyMemberRole('role').notNull().default('Admin'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const employeeStatus = pgEnum('employee_status', ['Active', 'Inactive']);
export const employmentType = pgEnum('employment_type', [
  'Full-time',
  'Part-time',
  'Intern',
  'Contractor',
]);

/** A payroll employee, always scoped to a single company. */
export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  email: text('email'),
  trn: text('trn').notNull(),
  nis: text('nis').notNull(),
  salary: numeric('salary', { precision: 14, scale: 2 }).notNull().default('0'),
  status: employeeStatus('status').notNull().default('Active'),
  employmentType: employmentType('employment_type').notNull().default('Full-time'),
  deductions: jsonb('deductions').$type<{ type: string; amount: number }[]>().default([]),
  startDate: text('start_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/** A completed or pending payroll run, scoped to a single company. */
export const payrollRuns = pgTable('payroll_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  runNumber: serial('run_number').notNull(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  period: text('period').notNull(),
  employeesCount: integer('employees_count').notNull(),
  totalGrossPay: numeric('total_gross_pay', { precision: 14, scale: 2 }).notNull().default('0'),
  totalNetPay: numeric('total_net_pay', { precision: 14, scale: 2 }).notNull().default('0'),
  totalTax: numeric('total_tax', { precision: 14, scale: 2 }).notNull().default('0'),
  totalNis: numeric('total_nis', { precision: 14, scale: 2 }).notNull().default('0'),
  status: text('status').notNull().default('Completed'), // 'Completed' | 'Pending' | 'Processing'
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  members: many(companyMembers),
  employees: many(employees),
  payrollRuns: many(payrollRuns),
}));

export const companyMembersRelations = relations(companyMembers, ({ one }) => ({
  company: one(companies, {
    fields: [companyMembers.companyId],
    references: [companies.id],
  }),
}));

export const employeesRelations = relations(employees, ({ one }) => ({
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
}));

export const payrollRunsRelations = relations(payrollRuns, ({ one }) => ({
  company: one(companies, {
    fields: [payrollRuns.companyId],
    references: [companies.id],
  }),
}));

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyMember = typeof companyMembers.$inferSelect;
export type NewCompanyMember = typeof companyMembers.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type PayrollRun = typeof payrollRuns.$inferSelect;
export type NewPayrollRun = typeof payrollRuns.$inferInsert;

