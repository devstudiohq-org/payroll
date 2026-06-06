import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../app/AppShell';
import { DashboardPage } from '../pages/DashboardPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'employees',
        element: <PlaceholderPage title="Employees" />,
      },
      {
        path: 'payroll-runs',
        element: <PlaceholderPage title="Payroll Runs" />,
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
        element: <PlaceholderPage title="Compliance" />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
      },
    ],
  },
]);
