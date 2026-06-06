import { AlertCircle, DollarSign, Loader2, Plus, Upload } from 'lucide-react';

import {
  StatCards,
  PayRunCard,
  TodoTasks,
  PayrollCostSummary,
  EmployeeSummary,
} from '../components';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const { data, isPending, isError } = useDashboard();

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
          <AlertCircle className="h-7 w-7 text-red-600" strokeWidth={1.75} />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-ink">Couldn't load dashboard</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Something went wrong while fetching your dashboard. Please try again.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
      </div>
    );
  }

  const { user, org, stats, currentPayRun, todoTasks, costSummary, taxSummary } = data;

  return (
    <>
      {/* Welcome row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Welcome {user.firstName}!</h1>
          <p className="mt-1 text-sm text-muted">
            {org.name} • {org.industry}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <DollarSign className="h-4 w-4" strokeWidth={2} />
            Run Payroll
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Employee
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50">
            <Upload className="h-4 w-4" strokeWidth={2} />
            Upload Changes
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6">
        <StatCards stats={stats} />
      </div>

      {/* Pay run + To Do tasks */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PayRunCard payRun={currentPayRun} />
        </div>
        <div>
          <TodoTasks tasks={todoTasks} />
        </div>
      </div>

      {/* Employee summary */}
      <div className="mt-8">
        <EmployeeSummary summary={taxSummary} />
      </div>

      {/* Payroll cost summary */}
      <div className="mt-6">
        <PayrollCostSummary summary={costSummary} />
      </div>
    </>
  );
}
