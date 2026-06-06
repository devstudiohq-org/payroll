import type { HealthResponse } from '@starter/types';

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
