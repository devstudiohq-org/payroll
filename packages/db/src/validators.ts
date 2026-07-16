import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { appMetadata, companies, companyMembers, employees, payrollRuns } from './schema';

export const appMetadataInsertSchema = createInsertSchema(appMetadata);
export const appMetadataSelectSchema = createSelectSchema(appMetadata);

export const companySelectSchema = createSelectSchema(companies);
export const companyMemberSelectSchema = createSelectSchema(companyMembers);
export const employeeSelectSchema = createSelectSchema(employees);
export const payrollRunSelectSchema = createSelectSchema(payrollRuns);

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

/** Payload for creating a payroll run. */
export const createPayrollRunSchema = z.object({
  period: z.string().trim().min(1, 'Period is required'),
  employeesCount: z.coerce.number().int().min(0),
  totalGrossPay: z.coerce.number().min(0),
  totalNetPay: z.coerce.number().min(0),
  totalTax: z.coerce.number().min(0),
  totalNis: z.coerce.number().min(0),
  status: z.enum(['Completed', 'Pending', 'Processing']).default('Completed'),
});

export const companyIdParamSchema = z.object({
  id: z.string().uuid('A valid company id is required'),
});

export const companyScopeParamSchema = z.object({
  companyId: z.string().uuid('A valid company id is required'),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type CompanyMemberInput = z.infer<typeof companyMemberInputSchema>;
export type CreatePayrollRunInput = z.infer<typeof createPayrollRunSchema>;

