import type { HealthResponse } from '@starter/types';

import { dashboardData, type DashboardData } from '../../data/dashboard';

export function resolveApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_URL ?? '/api';

  return baseUrl.replace(/\/$/, '');
}

export async function fetchHealth() {
  const response = await fetch(`${resolveApiBaseUrl()}/health`);

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}

export function fetchDashboard(): Promise<DashboardData> {
  // TODO: replace the mock with a real request once the dashboard endpoint is
  // backed by the database, e.g.:
  //   const response = await fetch(`${resolveApiBaseUrl()}/dashboard`);
  //   if (!response.ok) throw new Error(`Dashboard request failed: ${response.status}`);
  //   return (await response.json()) as DashboardData;
  return Promise.resolve(dashboardData);
}

// ──────── Employee API ────────

export type ApiEmployee = {
  id: number;
  name: string;
  email: string;
  startDate: string;
  role: string;
  department: string;
  trn: string;
  nis: string;
  salary: string;
  taxCode: string;
  status: string;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  createdAt: string;
};

export type CreateEmployeePayload = {
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

export async function fetchEmployees(): Promise<ApiEmployee[]> {
  const response = await fetch(`${resolveApiBaseUrl()}/employees`);

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status}`);
  }

  return (await response.json()) as ApiEmployee[];
}

export async function apiCreateEmployee(data: CreateEmployeePayload): Promise<ApiEmployee> {
  const response = await fetch(`${resolveApiBaseUrl()}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create employee: ${response.status}`);
  }

  return (await response.json()) as ApiEmployee;
}

export async function apiCreateEmployeesBulk(
  employees: CreateEmployeePayload[],
): Promise<ApiEmployee[]> {
  const response = await fetch(`${resolveApiBaseUrl()}/employees/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employees }),
  });

  if (!response.ok) {
    throw new Error(`Failed to bulk create employees: ${response.status}`);
  }

  return (await response.json()) as ApiEmployee[];
}

export async function apiUpdateEmployee(
  id: number,
  data: Partial<CreateEmployeePayload>,
): Promise<ApiEmployee> {
  const response = await fetch(`${resolveApiBaseUrl()}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update employee: ${response.status}`);
  }

  return (await response.json()) as ApiEmployee;
}

export async function apiDeleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${resolveApiBaseUrl()}/employees/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete employee: ${response.status}`);
  }
}

