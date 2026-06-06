import ComplianceRow from './ComplianceRow';
import { ComplianceReport } from '../types/compliance';
import { ShieldAlert } from 'lucide-react';

interface Props {
  reports: ComplianceReport[];
  totalReportsCount: number;
  searchQuery: string;
  selectedType: string;
}

export default function ComplianceTable({
  reports,
  totalReportsCount,
  searchQuery,
  selectedType,
}: Props) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <ShieldAlert size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No compliance reports found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            {searchQuery || selectedType !== 'All'
              ? 'Try adjusting your search query or filters.'
              : 'Generate your first compliance report to get started.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-[#FAFAFA] h-[60px]">
              <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Report Type
              </th>
              <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Period
              </th>
              <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Generated
              </th>
              <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Filed
              </th>
              <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report, index) => (
              <ComplianceRow key={index} report={report} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="h-[70px] border-t border-slate-100 px-8 flex items-center justify-between">
        <div className="text-sm text-slate-500 font-medium">
          Showing {reports.length} of {totalReportsCount} reports
        </div>

        <div className="flex gap-3">
          <button className="h-[40px] px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            Previous
          </button>
          <button className="h-[40px] px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
