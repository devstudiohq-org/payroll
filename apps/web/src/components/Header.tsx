import { Wallet, Search, Building2, Bell, Settings, ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 bg-navy px-4 text-white sm:px-6">
      {/* Brand */}
      <div className="flex w-60 shrink-0 items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <Wallet className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span className="text-lg font-bold">Payroll</span>
      </div>

      {/* Search */}
      <div className="relative mx-auto hidden max-w-xl flex-1 md:block">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search Employee"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-4 md:ml-0">
        <button className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="h-5 w-5" strokeWidth={1.75} />
          <span className="hidden sm:inline">TechNova Solutions</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        <button className="text-slate-300 hover:text-white">
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button className="text-slate-300 hover:text-white">
          <Settings className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <img
          src="https://i.pravatar.cc/80?img=47"
          alt="User avatar"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
        />
      </div>
    </header>
  )
}
