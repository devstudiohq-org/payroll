/**
 * Dashboard view-model + placeholder data.
 *
 * This is the single source of the dashboard's data. When the payroll API is
 * available, replace `dashboardData` with a query hook (see `useHealthCheck`
 * for the pattern) that returns the same `DashboardData` shape — the
 * presentational components below take it all via props and need no changes.
 */

export interface OrgInfo {
  name: string;
  industry: string;
}

export interface DashboardStats {
  activeEmployees: number;
  monthlyPayrollCost: number;
  payrollRunsTotal: number;
}

export interface CurrentPayRun {
  periodStart: string; // ISO date (YYYY-MM-DD)
  periodEnd: string; // ISO date (YYYY-MM-DD)
  status: string;
  netPay: number;
  payDate: string; // ISO date (YYYY-MM-DD)
  employeeCount: number;
}

export interface TodoTask {
  id: string;
  text: string;
}

export interface CostSummaryItem {
  label: string;
  value: number;
  /** Tailwind background class used for both the bar fill and the dot. */
  colorClass: string;
}

export interface CostSummary {
  period: string;
  items: CostSummaryItem[];
}

export interface TaxLine {
  outstanding: number;
  overdue: number;
}

export interface EmployeeBreakdown {
  hourly: number;
  salaried: number;
}

export interface TaxSummary {
  federal: TaxLine;
  provincial: TaxLine;
  employees: EmployeeBreakdown;
}

export interface DashboardData {
  user: { firstName: string };
  org: OrgInfo;
  stats: DashboardStats;
  currentPayRun: CurrentPayRun;
  todoTasks: TodoTask[];
  costSummary: CostSummary;
  taxSummary: TaxSummary;
}

export const dashboardData: DashboardData = {
  user: { firstName: 'Bonita' },
  org: { name: 'TechNova Solutions', industry: 'Technology' },
  stats: {
    activeEmployees: 24,
    monthlyPayrollCost: 55376.44,
    payrollRunsTotal: 12,
  },
  currentPayRun: {
    periodStart: '2025-09-16',
    periodEnd: '2025-09-30',
    status: 'Approved',
    netPay: 55376.44,
    payDate: '2026-01-30',
    employeeCount: 24,
  },
  todoTasks: [
    { id: 'tax-overdue', text: '1 Tax payment(s) are overdue to be paid.' },
    { id: 'forms-pending', text: '2 Form(s) are pending to be filed.' },
  ],
  costSummary: {
    period: 'This year',
    items: [
      { label: 'Net Pay', value: 171042.36, colorClass: 'bg-blue-600' },
      { label: 'Taxes', value: 62026.52, colorClass: 'bg-blue-400' },
      { label: 'Benefits', value: 15250.0, colorClass: 'bg-blue-300' },
      { label: 'Deductions', value: 9860.0, colorClass: 'bg-slate-500' },
    ],
  },
  taxSummary: {
    federal: { outstanding: 20711.78, overdue: 20711.78 },
    provincial: { outstanding: 3764.81, overdue: 3764.81 },
    employees: { hourly: 9, salaried: 15 },
  },
};
