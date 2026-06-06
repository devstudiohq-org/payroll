import type { ElementType } from 'react'
import { Users, DollarSign } from 'lucide-react'

import type { DashboardStats } from '../data/dashboard'
import { formatCurrency, formatNumber } from '../lib/format'

type Stat = {
  label: string
  value: string
  icon: ElementType
  iconBg: string
  iconColor: string
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  const items: Stat[] = [
    {
      label: 'Active Employees',
      value: formatNumber(stats.activeEmployees),
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Monthly Payroll Cost',
      value: formatCurrency(stats.monthlyPayrollCost),
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Payroll Runs (Total)',
      value: formatNumber(stats.payrollRunsTotal),
      icon: DollarSign,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm text-muted">{label}</p>
            <p className="min-h-8 text-2xl font-bold text-ink">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
