import { useState, useMemo } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useActiveCompany } from '../hooks/useActiveCompany';
import { usePayrollRuns } from '../hooks/usePayrollRuns';
import PayrollTable from '../components/PayrollTable';
import { RunPayrollModal } from '../components/RunPayrollModal';
import { EditPayrunModal } from '../components/EditPayrunModal';
import type { PayrollRunDto } from '@starter/types';

export default function PayrollRuns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('run') === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewRun, setViewRun] = useState<PayrollRunDto | null>(null);

  const activeCompany = useActiveCompany();
  const { data: runs = [], isPending: isLoadingRuns, refetch } = usePayrollRuns(
    activeCompany?.id ?? null,
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (searchParams.get('run') === 'true') {
      setSearchParams({});
    }
  };

  const handleView = (rowId: string) => {
    const run = runs.find((r) => `#${String(r.runNumber).padStart(6, '0')}` === rowId);
    if (run) setViewRun(run);
  };

  // Map API DTOs to UI table format
  const mappedRuns = useMemo(() => {
    return runs.map((run) => ({
      id: `#${String(run.runNumber).padStart(6, '0')}`,
      period: run.period,
      employees: run.employeesCount,
      totalNetPay: run.totalNetPay,
      status: run.status,
      completed: new Date(run.completedAt).toLocaleDateString('en-US'),
    }));
  }, [runs]);

  // Filter payroll runs based on search query
  const filteredRuns = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return mappedRuns.filter((run) => {
      return (
        run.id.toLowerCase().includes(query) ||
        run.period.toLowerCase().includes(query) ||
        run.status.toLowerCase().includes(query)
      );
    });
  }, [mappedRuns, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Payroll Runs</h1>
          <p className="mt-1 text-sm text-muted">
            Process and manage payroll for {activeCompany?.name ?? 'your company'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
        >
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
      {isLoadingRuns ? (
        <div className="flex min-h-[200px] items-center justify-center text-muted">
          <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
        </div>
      ) : (
        <PayrollTable
          runs={filteredRuns}
          totalRunsCount={mappedRuns.length}
          searchQuery={searchQuery}
          onView={handleView}
        />
      )}

      {/* Wizard Modal */}
      <RunPayrollModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => void refetch()}
      />

      {/* Editable payrun preview */}
      {viewRun && activeCompany && (
        <EditPayrunModal
          company={activeCompany}
          run={viewRun}
          onClose={() => setViewRun(null)}
        />
      )}
    </div>
  );
}

