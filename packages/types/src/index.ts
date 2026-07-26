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
  employeeCount: number;
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
  employeesCount: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTax: number;
  totalNis: number;
  status?: 'Completed' | 'Pending' | 'Processing';
}
