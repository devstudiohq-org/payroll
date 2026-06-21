import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useCompanyStore } from '../store/company-store';

/**
 * Gate for the main app shell: a company must be selected before payroll pages
 * are reachable. Sends the user to the company picker otherwise.
 */
export function RequireCompany({ children }: { children: ReactElement }) {
  const activeCompanyId = useCompanyStore((state) => state.activeCompanyId);

  if (!activeCompanyId) {
    return <Navigate to="/select-company" replace />;
  }

  return children;
}
