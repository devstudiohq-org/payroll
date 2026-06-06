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
