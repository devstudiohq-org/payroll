import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../app/AppShell';
import { RequireAuth } from '../app/RequireAuth';
import { DashboardPage } from '../pages/DashboardPage';
import Employees from '../pages/Employees';
import { LoginPage } from '../pages/LoginPage';
import { PayslipsPage } from '../pages/PayslipsPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
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
        element: <PlaceholderPage title="Payroll Runs" />,
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
        element: <PlaceholderPage title="Compliance" />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
