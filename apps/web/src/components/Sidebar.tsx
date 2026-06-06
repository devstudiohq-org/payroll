import type { ElementType } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ReceiptText,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';

type NavItem = {
  label: string;
  icon: ElementType;
  to: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Employees', icon: Users, to: '/employees' },
  { label: 'Payroll Runs', icon: DollarSign, to: '/payroll-runs' },
  { label: 'Payslips', icon: ReceiptText, to: '/payslips' },
  { label: 'Reports', icon: BarChart3, to: '/reports' },
  { label: 'Compliance', icon: ShieldCheck, to: '/compliance' },
  { label: 'Settings', icon: Settings, to: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-brand'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
              ].join(' ')
            }
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="my-5 border-t border-slate-200" />

      <a
        href="#"
        className="px-3 text-sm font-medium text-slate-500 hover:text-ink"
      >
        Contact Support
      </a>
    </aside>
  );
}
