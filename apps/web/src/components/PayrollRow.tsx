import { PayrollRun } from '../types/payroll';
import { Eye, MoreVertical } from 'lucide-react';

interface Props {
  payroll: PayrollRun;
}

export default function PayrollRow({ payroll }: Props) {
  return (
    <tr className="h-[72px] hover:bg-slate-50/50 transition-colors border-b border-slate-100">
      <td className="px-8 py-3 text-sm font-semibold text-slate-900">
        {payroll.id}
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        {payroll.period}
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        {payroll.employees}
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        $
        {payroll.totalNetPay.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-8 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            payroll.status === 'Completed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : payroll.status === 'Processing'
                ? 'bg-blue-50 text-blue-700 border-blue-100'
                : 'bg-amber-50 text-amber-700 border-amber-100'
          }`}
        >
          {payroll.status}
        </span>
      </td>
      <td className="px-8 py-3 text-sm text-slate-600 font-medium">
        {payroll.completed}
      </td>
      <td className="px-8 py-3 text-right">
        <div className="flex justify-end gap-3">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <Eye size={18} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <MoreVertical size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
