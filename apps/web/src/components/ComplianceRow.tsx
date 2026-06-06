import { FileText, Download, Check } from 'lucide-react';
import { ComplianceReport } from '../types/compliance';

interface Props {
  report: ComplianceReport;
}

export default function ComplianceRow({ report }: Props) {
  const isSO1 = report.reportType === 'SO1 File';

  return (
    <tr className="h-[72px] hover:bg-slate-50/50 transition-colors border-b border-slate-100">
      <td className="px-8 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center border ${
              isSO1
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : 'bg-purple-50 text-purple-600 border-purple-100'
            }`}
          >
            <FileText size={18} />
          </div>
          <span className="text-sm font-semibold text-slate-900">{report.reportType}</span>
        </div>
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        {report.period}
      </td>
      <td className="px-8 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            report.status === 'Filed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-blue-50 text-blue-700 border-blue-100'
          }`}
        >
          {report.status}
        </span>
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        {report.generated}
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        {report.filed !== '-' ? (
          <div className="flex items-center gap-1.5">
            <Check size={16} className="text-emerald-500 shrink-0" strokeWidth={3} />
            <span>{report.filed}</span>
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-8 py-3 text-right">
        <div className="flex justify-end">
          <button className="text-brand hover:text-blue-700 text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Download size={15} strokeWidth={2.5} />
            Download
          </button>
        </div>
      </td>
    </tr>
  );
}
