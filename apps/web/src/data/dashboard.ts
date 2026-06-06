/**
 * Dashboard view-model + (currently empty) data.
 *
 * Every value below is intentionally blank — the dashboard cards render their
 * structure with no data until the payroll API is wired up. When the endpoint
 * exists, replace `dashboardData` with a query hook (see `useHealthCheck` for
 * the pattern) that returns the same `DashboardData` shape; the presentational
 * components already handle null/empty values, so no card changes are needed.
 *
 * Value fields are nullable to represent "not yet loaded from the database".
 */

export interface OrgInfo {
  name: string;
  industry: string;
}

export interface DashboardStats {
  activeEmployees: number | null;
  monthlyPayrollCost: number | null;
  payrollRunsTotal: number | null;
}

export interface CurrentPayRun {
  periodStart: string | null; // ISO date (YYYY-MM-DD)
  periodEnd: string | null; // ISO date (YYYY-MM-DD)
  status: string | null;
  netPay: number | null;
  payDate: string | null; // ISO date (YYYY-MM-DD)
  employeeCount: number | null;
}

export interface TodoTask {
  id: string;
  text: string;
}

export interface CostSummaryItem {
  /** Category label (structural, not data). */
  label: string;
  value: number | null;
  /** Tailwind background class used for both the bar fill and the dot. */
  colorClass: string;
}

export interface CostSummary {
  period: string;
  items: CostSummaryItem[];
}

export interface TaxLine {
  outstanding: number | null;
  overdue: number | null;
}

export interface EmployeeBreakdown {
  hourly: number | null;
  salaried: number | null;
}

export interface TaxSummary {
  federal: TaxLine;
  provincial: TaxLine;
  employees: EmployeeBreakdown;
}

export interface DashboardData {
  org: OrgInfo;
  stats: DashboardStats;
  currentPayRun: CurrentPayRun;
  todoTasks: TodoTask[];
  costSummary: CostSummary;
  taxSummary: TaxSummary;
}

export const dashboardData: DashboardData = {
  org: { name: '', industry: '' },
  stats: {
    activeEmployees: null,
    monthlyPayrollCost: null,
    payrollRunsTotal: null,
  },
  currentPayRun: {
    periodStart: null,
    periodEnd: null,
    status: null,
    netPay: null,
    payDate: null,
    employeeCount: null,
  },
  todoTasks: [],
  costSummary: {
    period: 'This year',
    items: [
      { label: 'Net Pay', value: null, colorClass: 'bg-blue-600' },
      { label: 'Taxes', value: null, colorClass: 'bg-blue-400' },
      { label: 'Benefits', value: null, colorClass: 'bg-blue-300' },
      { label: 'Deductions', value: null, colorClass: 'bg-slate-500' },
    ],
  },
  taxSummary: {
    federal: { outstanding: null, overdue: null },
    provincial: { outstanding: null, overdue: null },
    employees: { hourly: null, salaried: null },
  },
};
