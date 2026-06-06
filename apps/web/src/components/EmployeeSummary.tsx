import type { ElementType } from 'react'
import { Landmark, Building } from 'lucide-react'

import type { EmployeeBreakdown, TaxLine, TaxSummary } from '../data/dashboard'
import { formatCurrency, formatNumber } from '../lib/format'

export function EmployeeSummary({ summary }: { summary: TaxSummary }) {
  return (
    <section>
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Employee Summary
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <TaxCard title="Federal Tax" icon={Landmark} line={summary.federal} />
        <TaxCard title="Provincial Tax" icon={Building} line={summary.provincial} />
        <ActiveEmployeesCard employees={summary.employees} />
      </div>
    </section>
  )
}

function TaxCard({
  title,
  icon: Icon,
  line,
}: {
  title: string
  icon: ElementType
  line: TaxLine
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
          <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
        </span>
        <h4 className="text-base font-semibold text-ink">{title}</h4>
      </div>

      <div className="mt-5 border-l-4 border-brand pl-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Total Outstanding
        </p>
        <p className="mt-1 min-h-8 text-2xl font-bold text-ink">
          {formatCurrency(line.outstanding)}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted">Overdue Amount:</p>
        <p className="min-h-7 text-lg font-semibold text-ink">{formatCurrency(line.overdue)}</p>
      </div>
    </div>
  )
}

function ActiveEmployeesCard({ employees }: { employees: EmployeeBreakdown }) {
  const hasData = employees.hourly != null || employees.salaried != null
  const total = hasData ? (employees.hourly ?? 0) + (employees.salaried ?? 0) : null
  const max = Math.max(0, employees.hourly ?? 0, employees.salaried ?? 0)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Active Employees
      </p>
      <p className="mt-1 min-h-9 text-3xl font-bold text-ink">{formatNumber(total)}</p>
      <a
        href="#"
        className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
      >
        View Employees
      </a>

      {/* Simple bar chart */}
      <div className="mt-4 flex h-24 items-end justify-end gap-6">
        <Bar label="Hourly" value={employees.hourly} max={max} colorClass="bg-blue-600" />
        <Bar label="Salaried" value={employees.salaried} max={max} colorClass="bg-blue-400" />
      </div>
    </div>
  )
}

function Bar({
  label,
  value,
  max,
  colorClass,
}: {
  label: string
  value: number | null
  max: number
  colorClass: string
}) {
  const height = value != null && max > 0 ? (value / max) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-9 rounded-t ${colorClass}`} style={{ height: `${height}%` }} />
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  )
}
