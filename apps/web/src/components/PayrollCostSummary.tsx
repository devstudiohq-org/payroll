import { ChevronDown } from 'lucide-react';

import type { CostSummary } from '../data/dashboard';
import { formatCurrency } from '../lib/format';

export function PayrollCostSummary({ summary }: { summary: CostSummary }) {
  const max = Math.max(...summary.items.map((item) => item.value));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Payroll Cost Summary
        </h3>
        <button className="flex items-center gap-1 text-sm font-medium text-ink hover:text-brand">
          {summary.period}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {/* Bars */}
      <div className="mt-6 flex flex-col gap-4">
        {summary.items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="w-24 shrink-0 text-sm text-ink">{item.label}</span>

            <div className="h-6 flex-1 overflow-hidden rounded-md bg-slate-100">
              <div
                className={`h-full rounded-md ${item.colorClass}`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>

            <span className="flex w-36 shrink-0 items-center justify-end gap-2 text-sm font-semibold text-ink">
              <span className={`h-2 w-2 rounded-full ${item.colorClass}`} />
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
