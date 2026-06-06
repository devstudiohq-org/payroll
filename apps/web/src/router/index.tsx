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
<<<<<<< HEAD
=======
import Employees from '../pages/Employees';
>>>>>>> 2d0ead9fb1d733e260c93e8162d6f06cb7b78db8

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
