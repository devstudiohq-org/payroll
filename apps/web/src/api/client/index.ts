import type {
  ApiErrorResponse,
  CompanyDto,
  CreateCompanyInput,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeDto,
  HealthResponse,
  PayrollRunDto,
  CreatePayrollRunInput,
} from '@starter/types';

import { dashboardData, type DashboardData } from '../../data/dashboard';

export function resolveApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_URL ?? '/api';

  return baseUrl.replace(/\/$/, '');
}

/** Parse a JSON response, throwing a readable error built from the API's error body. */
async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorResponse;
      if (body?.error?.message) {
        message = body.error.issues?.length
          ? `${body.error.message}: ${body.error.issues.join(', ')}`
          : body.error.message;
      }
    } catch {
      // Response had no JSON body — keep the status-based message.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function fetchHealth() {
  const response = await fetch(`${resolveApiBaseUrl()}/health`);

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}

export async function fetchCompanies(): Promise<CompanyDto[]> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies`);
  const data = await parseJson<{ companies: CompanyDto[] }>(response);
  return data.companies;
}

export async function fetchCompany(id: string): Promise<CompanyDto> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies/${id}`);
  const data = await parseJson<{ company: CompanyDto }>(response);
  return data.company;
}

export async function createCompany(input: CreateCompanyInput): Promise<CompanyDto> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ company: CompanyDto }>(response);
  return data.company;
}

export async function fetchEmployees(companyId: string): Promise<EmployeeDto[]> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies/${companyId}/employees`);
  const data = await parseJson<{ employees: EmployeeDto[] }>(response);
  return data.employees;
}

export async function createEmployee(
  companyId: string,
  input: CreateEmployeeInput,
): Promise<EmployeeDto> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies/${companyId}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ employee: EmployeeDto }>(response);
  return data.employee;
}

export async function updateEmployee(
  companyId: string,
  employeeId: string,
  input: UpdateEmployeeInput,
): Promise<EmployeeDto> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies/${companyId}/employees/${employeeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ employee: EmployeeDto }>(response);
  return data.employee;
}

export async function fetchPayrollRuns(companyId: string): Promise<PayrollRunDto[]> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies/${companyId}/payroll-runs`);
  const data = await parseJson<{ runs: PayrollRunDto[] }>(response);
  return data.runs;
}

export async function createPayrollRun(
  companyId: string,
  input: CreatePayrollRunInput,
): Promise<PayrollRunDto> {
  const response = await fetch(`${resolveApiBaseUrl()}/companies/${companyId}/payroll-runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ run: PayrollRunDto }>(response);
  return data.run;
}

export function fetchDashboard(): Promise<DashboardData> {
  // TODO: replace the mock with a real request once the dashboard endpoint is
  // backed by the database, e.g.:
  //   const response = await fetch(`${resolveApiBaseUrl()}/dashboard`);
  //   if (!response.ok) throw new Error(`Dashboard request failed: ${response.status}`);
  //   return (await response.json()) as DashboardData;
  return Promise.resolve(dashboardData);
}

