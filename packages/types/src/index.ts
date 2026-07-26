export * from './tax';

export interface HealthResponse {
  service: 'api';
  status: 'ok';
  timestamp: string;
  uptimeSeconds: number;
  nodeEnv?: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    issues?: string[];
  };
}

export type CompanyMemberRole = 'Admin' | 'Manager' | 'Viewer';

export interface CompanyMemberDto {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  role: CompanyMemberRole;
  createdAt: string;
}

export interface CompanyDto {
  id: string;
  name: string;
  industry: string;
  /** The declared headcount captured when the company was created. */
  employeeCount: number;
  /** The live count of active employee records for this company. */
  activeEmployeeCount: number;
  address: string;
  trn: string;
  nis: string;
  email: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  members?: CompanyMemberDto[];
}

export interface CreateCompanyMemberInput {
  fullName: string;
  email: string;
  role: CompanyMemberRole;
}

export interface CreateCompanyInput {
  name: string;
  industry: string;
  employeeCount: number;
  address: string;
  trn: string;
  nis: string;
  email: string;
  logoUrl?: string;
  members: CreateCompanyMemberInput[];
}

export type EmployeeStatus = 'Active' | 'Inactive';

export interface EmployeeDto {
  id: string;
  companyId: string;
  name: string;
  role: string;
  email: string | null;
  trn: string;
  nis: string;
  salary: number;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  name: string;
  role: string;
  email?: string;
  trn: string;
  nis: string;
  salary: number;
  status: EmployeeStatus;
}

export interface PayrollRunDto {
  id: string;
  runNumber: number;
  companyId: string;
  period: string;
  employeesCount: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTax: number;
  totalNis: number;
  status: 'Completed' | 'Pending' | 'Processing';
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollRunInput {
  period: string;
  status?: 'Completed' | 'Pending' | 'Processing';
}

/** A company's tax configuration. All monetary amounts are monthly. */
export interface TaxConfigDto {
  companyId: string;
  taxFreeThreshold: number;
  nisRate: number;
  nhtRate: number;
  edtaxRate: number;
  standardTaxRate: number;
  highEarnerThreshold: number;
  highEarnerTaxRate: number;
  /** True when no configuration has been saved yet and defaults are returned. */
  isDefault: boolean;
  updatedAt: string | null;
}

export interface UpsertTaxConfigInput {
  taxFreeThreshold: number;
  nisRate: number;
  nhtRate: number;
  edtaxRate: number;
  standardTaxRate: number;
  highEarnerThreshold: number;
  highEarnerTaxRate: number;
}

/** A named money adjustment on a payslip (e.g. Overtime, Pension, Health Insurance). */
export interface PayAdjustment {
  label: string;
  amount: number;
}

/** A single employee's computed pay summary for a payslip. */
export interface PayslipLine {
  /** The stored payslip-item id (present when loaded from a saved run). */
  id?: string;
  employeeId: string;
  name: string;
  trn: string;
  nis: string;
  role: string;
  /** Base salary before additions. */
  baseGross: number;
  /** Extra earnings such as overtime. */
  additions: PayAdjustment[];
  /** Voluntary/other deductions such as pension or insurance. */
  customDeductions: PayAdjustment[];
  /** baseGross + additions. */
  grossPay: number;
  taxablePay: number;
  incomeTax: number;
  nisDeduction: number;
  nhtDeduction: number;
  edtaxDeduction: number;
  /** Sum of customDeductions. */
  customDeductionsTotal: number;
  /** Statutory deductions + custom deductions. */
  totalDeductions: number;
  netPay: number;
}

export interface UpdatePayslipInput {
  additions: PayAdjustment[];
  customDeductions: PayAdjustment[];
}
