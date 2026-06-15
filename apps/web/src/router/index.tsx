import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../app/AppShell';
import { RequireAuth } from '../app/RequireAuth';
import { RequireCompany } from '../app/RequireCompany';
import { DashboardPage } from '../pages/DashboardPage';
import Employees from '../pages/Employees';
import PayrollRuns from '../pages/PayrollRuns';
import CompliancePage from '../pages/CompliancePage';
import { LoginPage } from '../pages/LoginPage';
import { PayslipsPage } from '../pages/PayslipsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SelectCompanyPage } from '../pages/SelectCompanyPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <RequireCompany>
          <AppShell />
        </RequireCompany>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'employees',
        element: <Employees />,
      },
      {
        path: 'payroll-runs',
        element: <PayrollRuns />,
      },
      {
        path: 'payslips',
        element: <PayslipsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'compliance',
        element: <CompliancePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/select-company',
    element: (
      <RequireAuth>
        <SelectCompanyPage />
      </RequireAuth>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

