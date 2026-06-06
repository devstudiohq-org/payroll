import { Info } from 'lucide-react'

import type { CurrentPayRun } from '../data/dashboard'
import { formatCurrency, formatLongDate, formatSlashDate } from '../lib/format'

export function PayRunCard({ payRun }: { payRun: CurrentPayRun }) {
  return (
    <div className="rounded-xl border-2 border-brand bg-white p-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-ink">
            Process Pay Run for {formatSlashDate(payRun.periodStart)} -{' '}
            {formatSlashDate(payRun.periodEnd)}
          </h2>
          <span className="rounded-md bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {payRun.status}
          </span>
        </div>
        <button className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          View Details
        </button>
      </div>

      {/* Figures */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Figure label="Employees' Net Pay" value={formatCurrency(payRun.netPay)} />
        <Figure label="Pay Date" value={formatLongDate(payRun.payDate)} />
        <Figure label="No. of Employees" value={String(payRun.employeeCount)} />
      </div>

      {/* Footer note */}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted">
        <Info className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
        <span>
          Pay your employees on {formatSlashDate(payRun.periodEnd)}. Record it here once you made the
          payment.
        </span>
      </div>
    </div>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  )
}
