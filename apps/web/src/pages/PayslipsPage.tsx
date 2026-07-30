import { useMemo, useState } from 'react';
import { Download, Loader2, Mail, Search } from 'lucide-react';
import type { PayrollRunDto } from '@starter/types';

import { useActiveCompany } from '../hooks/useActiveCompany';
import { usePayrollRuns } from '../hooks/usePayrollRuns';
import { fetchPayslips } from '../api/client';
import { generatePayslipsPdf } from '../lib/payslipPdf';
import { formatCurrency } from '../lib/format';

export function PayslipsPage() {
  const [query, setQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const activeCompany = useActiveCompany();
  const { data: runs = [], isPending } = usePayrollRuns(activeCompany?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return runs;
    return runs.filter(
      (run) =>
        run.period.toLowerCase().includes(q) ||
        `#${String(run.runNumber).padStart(6, '0')}`.includes(q),
    );
  }, [runs, query]);

  function handleDownload(run: PayrollRunDto) {
    if (!activeCompany) return;
    setDownloadingId(run.id);
    void (async () => {
      try {
        const lines = await fetchPayslips(activeCompany.id, run.id);
        generatePayslipsPdf(activeCompany, run, lines);
      } finally {
        setDownloadingId(null);
      }
    })();
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-ink">Payslips</h1>
        <p className="mt-1 text-sm text-muted">
          Download payslips for {activeCompany?.name ?? 'your company'}. Each payslip batch is linked
          to its payroll run.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by run id or period..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {isPending ? (
        <div className="mt-6 flex min-h-[160px] items-center justify-center text-muted">
          <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <Mail className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <h2 className="mt-5 text-lg font-bold text-ink">No Payslips Found</h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Process a payroll run to generate payslips you can download here.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="h-[60px] border-b border-slate-100 bg-[#FAFAFA]">
                  <Th>Run ID</Th>
                  <Th>Period</Th>
                  <Th>Employees</Th>
                  <Th>Total Net Pay</Th>
                  <Th className="text-right">Payslips</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((run) => (
                  <tr key={run.id} className="h-[72px] hover:bg-slate-50/50">
                    <td className="px-8 py-3 text-sm font-semibold text-slate-900">
                      #{String(run.runNumber).padStart(6, '0')}
                    </td>
                    <td className="px-8 py-3 text-sm font-medium text-slate-600">{run.period}</td>
                    <td className="px-8 py-3 text-sm font-medium text-slate-600">
                      {run.employeesCount}
                    </td>
                    <td className="px-8 py-3 text-sm font-medium text-slate-600">
                      {formatCurrency(run.totalNetPay)}
                    </td>
                    <td className="px-8 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(run)}
                        disabled={downloadingId === run.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50 disabled:opacity-60"
                      >
                        {downloadingId === run.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                        ) : (
                          <Download className="h-4 w-4" strokeWidth={2} />
                        )}
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-8 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}
