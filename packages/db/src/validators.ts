import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  appMetadata,
  companies,
  companyMembers,
  employees,
  payrollRuns,
  taxConfigurations,
} from './schema';

export const appMetadataInsertSchema = createInsertSchema(appMetadata);
export const appMetadataSelectSchema = createSelectSchema(appMetadata);

export const companySelectSchema = createSelectSchema(companies);
export const companyMemberSelectSchema = createSelectSchema(companyMembers);
export const employeeSelectSchema = createSelectSchema(employees);
export const payrollRunSelectSchema = createSelectSchema(payrollRuns);
export const taxConfigurationSelectSchema = createSelectSchema(taxConfigurations);

/** Payload for a single team member when creating a company. */
export const companyMemberInputSchema = z.object({
  fullName: z.string().trim().min(1, 'Member name is required'),
  email: z.string().trim().email('A valid member email is required'),
  role: z.enum(['Admin', 'Manager', 'Viewer']).default('Admin'),
});

/** Payload for creating a company along with its initial team members. */
export const createCompanySchema = z.object({
  name: z.string().trim().min(1, 'Company name is required'),
  industry: z.string().trim().min(1, 'Industry is required'),
  employeeCount: z.coerce.number().int().min(0, 'Number of employees must be 0 or more'),
  address: z.string().trim().min(1, 'Address is required'),
  trn: z.string().trim().min(1, 'TRN is required'),
  nis: z.string().trim().min(1, 'NIS number is required'),
  email: z.string().trim().email('A valid company email is required'),
  logoUrl: z.string().trim().url().optional().or(z.literal('')).optional(),
  members: z.array(companyMemberInputSchema).default([]),
});

/** Payload for adding an employee to a company. */
export const createEmployeeSchema = z.object({
  name: z.string().trim().min(1, 'Employee name is required'),
  role: z.string().trim().min(1, 'Role is required'),
  email: z.string().trim().email().optional().or(z.literal('')).optional(),
  trn: z.string().trim().min(1, 'TRN is required'),
  nis: z.string().trim().min(1, 'NIS number is required'),
  salary: z.coerce.number().min(0, 'Salary must be 0 or more').default(0),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

/**
 * Payload for creating a payroll run. Totals and per-employee payslip lines are
 * computed server-side from the company's active employees and tax configuration,
 * so the client only chooses the period (and optionally the status).
 */
export const createPayrollRunSchema = z.object({
  period: z.string().trim().min(1, 'Period is required'),
  status: z.enum(['Completed', 'Pending', 'Processing']).default('Completed'),
});

const percentRate = z.coerce
  .number()
  .min(0, 'Rate must be 0 or more')
  .max(100, 'Rate cannot exceed 100');

/** Payload for saving (upserting) a company's tax configuration. All amounts are monthly. */
export const upsertTaxConfigSchema = z.object({
  taxFreeThreshold: z.coerce.number().min(0, 'Tax-free threshold must be 0 or more').default(0),
  nisRate: percentRate.default(0),
  nhtRate: percentRate.default(0),
  edtaxRate: percentRate.default(0),
  standardTaxRate: percentRate.default(0),
  highEarnerThreshold: z.coerce
    .number()
    .min(0, 'High earner threshold must be 0 or more')
    .default(0),
  highEarnerTaxRate: percentRate.default(0),
});

export const companyIdParamSchema = z.object({
  id: z.string().uuid('A valid company id is required'),
});

export const companyScopeParamSchema = z.object({
  companyId: z.string().uuid('A valid company id is required'),
});

export const payrollRunScopeParamSchema = z.object({
  companyId: z.string().uuid('A valid company id is required'),
  runId: z.string().uuid('A valid payroll run id is required'),
});

export const payslipScopeParamSchema = z.object({
  companyId: z.string().uuid('A valid company id is required'),
  runId: z.string().uuid('A valid payroll run id is required'),
  payslipId: z.string().uuid('A valid payslip id is required'),
});

const adjustmentSchema = z.object({
  label: z.string().trim().min(1, 'A label is required'),
  amount: z.coerce.number().min(0, 'Amount must be 0 or more'),
});

/** Payload for editing a payslip line's additions and custom deductions. */
export const updatePayslipSchema = z.object({
  additions: z.array(adjustmentSchema).default([]),
  customDeductions: z.array(adjustmentSchema).default([]),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type CompanyMemberInput = z.infer<typeof companyMemberInputSchema>;
export type CreatePayrollRunInput = z.infer<typeof createPayrollRunSchema>;
export type UpsertTaxConfigInput = z.infer<typeof upsertTaxConfigSchema>;
export type UpdatePayslipInput = z.infer<typeof updatePayslipSchema>;

