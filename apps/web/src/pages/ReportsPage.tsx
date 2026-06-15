import type { ElementType } from 'react';
import { useState } from 'react';
import { Download, FileText, Plus } from 'lucide-react';

import { useActiveCompany } from '../hooks/useActiveCompany';
import { formatLongDate } from '../lib/format';

type ReportType = {
  title: string;
  description: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
};

const REPORT_TYPES: ReportType[] = [
  {
    title: 'Pay Register',
    description: 'Company-level payroll summary with totals',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Payroll Summary',
    description: 'Employee-level breakdown by period',
    icon: FileText,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Deduction Report',
    description: 'All deductions by type and employee',
    icon: FileText,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

interface GeneratedReport {
  id: string;
  type: string;
  period: string;
  generatedAt: string; // ISO date (YYYY-MM-DD)
  size: string;
}

export function ReportsPage() {
  const [filter, setFilter] = useState('all');
  const activeCompany = useActiveCompany();

  // No reports until the database is connected.
  const reports: GeneratedReport[] = [];

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Reports</h1>
          <p className="mt-1 text-sm text-muted">
            Generate and export payroll reports for {activeCompany?.name ?? 'your company'}
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Generate Report
        </button>
      </div>

      {/* Report type cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {REPORT_TYPES.map(({ title, description, icon: Icon, iconBg, iconColor }) => (
          <button
            key={title}
            type="button"
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-brand"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-ink" htmlFor="report-filter">
            Filter by:
          </label>
          <select
            id="report-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-48 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="all">All Types</option>
            <option value="pay-register">Pay Register</option>
            <option value="payroll-summary">Payroll Summary</option>
            <option value="deduction-report">Deduction Report</option>
          </select>
        </div>
      </div>

      {/* Reports table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3.5">Report Type</th>
                <th className="px-6 py-3.5">Period</th>
                <th className="px-6 py-3.5">Generated</th>
                <th className="px-6 py-3.5">Size</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                      <FileText className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
                      <h2 className="mt-4 text-base font-semibold text-ink">No reports yet</h2>
                      <p className="mt-1 max-w-sm text-sm text-muted">
                        Generate a report to see it listed here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-3 font-medium text-ink">
                        <FileText className="h-5 w-5 text-slate-400" strokeWidth={1.75} />
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink">{report.period}</td>
                    <td className="px-6 py-4 text-ink">{formatLongDate(report.generatedAt)}</td>
                    <td className="px-6 py-4 text-ink">{report.size}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-5">
                        <button className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                          <Download className="h-4 w-4" strokeWidth={1.75} />
                          Excel
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline">
                          <Download className="h-4 w-4" strokeWidth={1.75} />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-muted">
            Showing {reports.length} of {reports.length} reports
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
