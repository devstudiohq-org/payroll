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

type Adjustment = { label: string; amount: number };

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

/**
 * Per-company tax configuration. One row per company (unique company_id) drives
 * how employee deductions are calculated. All money amounts are monthly.
 */
export const taxConfigurations = pgTable('tax_configurations', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .notNull()
    .unique()
    .references(() => companies.id, { onDelete: 'cascade' }),
  // Monthly income up to this amount is not taxed.
  taxFreeThreshold: numeric('tax_free_threshold', { precision: 14, scale: 2 }).notNull().default('0'),
  // Percentage of gross contributed to NIS.
  nisRate: numeric('nis_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  // Percentage of gross contributed to NHT.
  nhtRate: numeric('nht_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  // Percentage of gross contributed to Education Tax (EDTAX).
  edtaxRate: numeric('edtax_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  // Percentage applied to taxable income within the standard band.
  standardTaxRate: numeric('standard_tax_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  // Monthly income above this amount is taxed at the high-earner rate. 0 disables the band.
  highEarnerThreshold: numeric('high_earner_threshold', { precision: 14, scale: 2 })
    .notNull()
    .default('0'),
  // Percentage applied to taxable income above the high-earner threshold.
  highEarnerTaxRate: numeric('high_earner_tax_rate', { precision: 5, scale: 2 })
    .notNull()
    .default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * A snapshot of one employee's pay for a specific payroll run. Written when the
 * run is created so payslips are generated from the run itself, unaffected by
 * later changes to the employee or tax configuration.
 */
export const payslipItems = pgTable('payslip_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  payrollRunId: uuid('payroll_run_id')
    .notNull()
    .references(() => payrollRuns.id, { onDelete: 'cascade' }),
  employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  trn: text('trn').notNull(),
  nis: text('nis').notNull(),
  baseGross: numeric('base_gross', { precision: 14, scale: 2 }).notNull().default('0'),
  additions: jsonb('additions').$type<Adjustment[]>().notNull().default([]),
  customDeductions: jsonb('custom_deductions').$type<Adjustment[]>().notNull().default([]),
  grossPay: numeric('gross_pay', { precision: 14, scale: 2 }).notNull().default('0'),
  taxablePay: numeric('taxable_pay', { precision: 14, scale: 2 }).notNull().default('0'),
  incomeTax: numeric('income_tax', { precision: 14, scale: 2 }).notNull().default('0'),
  nisDeduction: numeric('nis_deduction', { precision: 14, scale: 2 }).notNull().default('0'),
  nhtDeduction: numeric('nht_deduction', { precision: 14, scale: 2 }).notNull().default('0'),
  edtaxDeduction: numeric('edtax_deduction', { precision: 14, scale: 2 }).notNull().default('0'),
  customDeductionsTotal: numeric('custom_deductions_total', { precision: 14, scale: 2 })
    .notNull()
    .default('0'),
  totalDeductions: numeric('total_deductions', { precision: 14, scale: 2 }).notNull().default('0'),
  netPay: numeric('net_pay', { precision: 14, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const payslipItemsRelations = relations(payslipItems, ({ one }) => ({
  payrollRun: one(payrollRuns, {
    fields: [payslipItems.payrollRunId],
    references: [payrollRuns.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many, one }) => ({
  members: many(companyMembers),
  employees: many(employees),
  payrollRuns: many(payrollRuns),
  taxConfiguration: one(taxConfigurations),
}));

export const taxConfigurationsRelations = relations(taxConfigurations, ({ one }) => ({
  company: one(companies, {
    fields: [taxConfigurations.companyId],
    references: [companies.id],
  }),
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

export const payrollRunsRelations = relations(payrollRuns, ({ one, many }) => ({
  company: one(companies, {
    fields: [payrollRuns.companyId],
    references: [companies.id],
  }),
  payslipItems: many(payslipItems),
}));

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyMember = typeof companyMembers.$inferSelect;
export type NewCompanyMember = typeof companyMembers.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type PayrollRun = typeof payrollRuns.$inferSelect;
export type NewPayrollRun = typeof payrollRuns.$inferInsert;
export type TaxConfiguration = typeof taxConfigurations.$inferSelect;
export type NewTaxConfiguration = typeof taxConfigurations.$inferInsert;
export type PayslipItem = typeof payslipItems.$inferSelect;
export type NewPayslipItem = typeof payslipItems.$inferInsert;

