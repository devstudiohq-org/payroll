import { useState } from 'react';
import { Mail, Search } from 'lucide-react';

import { CURRENT_COMPANY_NAME } from '../data/company';

export function PayslipsPage() {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('all');

  return (
    <>
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Payslips</h1>
        <p className="mt-1 text-sm text-muted">
          View and manage payslips for {CURRENT_COMPANY_NAME}
        </p>
      </div>

      {/* Filter bar */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by employee name or TRN..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-44"
          >
            <option value="all">All Periods</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <Mail className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
          <h2 className="mt-5 text-lg font-bold text-ink">No Payslips Found</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Generate payslips from a completed payroll run to see them here.
          </p>
        </div>
      </div>
    </>
  );
}
