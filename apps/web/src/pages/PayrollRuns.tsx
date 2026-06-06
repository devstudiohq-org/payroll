import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { payrollRuns } from '../data/payrollRuns';
import PayrollTable from '../components/PayrollTable';

export default function PayrollRuns() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter payroll runs based on search query
  const filteredRuns = payrollRuns.filter((run) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      run.id.toLowerCase().includes(query) ||
      run.period.toLowerCase().includes(query) ||
      run.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Payroll Runs</h1>
          <p className="mt-1 text-sm text-muted">Process and manage payroll</p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Run Payroll
        </button>
      </div>

      {/* Search Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex h-[52px] border border-slate-200 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand rounded-xl flex items-center px-4 bg-white transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-3 w-full bg-transparent border-none outline-none text-sm text-ink placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table Section */}
      <PayrollTable
        runs={filteredRuns}
        totalRunsCount={payrollRuns.length}
        searchQuery={searchQuery}
      />
    </div>
  );
}
