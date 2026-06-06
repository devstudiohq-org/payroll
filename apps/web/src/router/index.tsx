import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../app/AppShell';
import { RequireAuth } from '../app/RequireAuth';
import { DashboardPage } from '../pages/DashboardPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { LoginPage } from '../pages/LoginPage';
import Employees from '../pages/Employees';
import PayrollRuns from '../pages/PayrollRuns';
import CompliancePage from '../pages/CompliancePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
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
        element: <PlaceholderPage title="Payslips" />,
      },
      {
        path: 'reports',
        element: <PlaceholderPage title="Reports" />,
      },
      {
        path: 'compliance',
        element: <CompliancePage />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

