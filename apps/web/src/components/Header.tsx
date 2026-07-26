import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  Search,
  Building2,
  Bell,
  Settings,
  ChevronDown,
  Check,
  Plus,
  User,
  LogOut,
} from 'lucide-react'

import { CreateCompanyModal } from './CreateCompanyModal'
import { useCompanies } from '../hooks/useCompanies'
import { useCompanyStore } from '../store/company-store'
import { useAuthStore } from '../store/auth-store'

export function Header() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const { data: companies } = useCompanies()
  const activeCompanyId = useCompanyStore((state) => state.activeCompanyId)
  const setActiveCompany = useCompanyStore((state) => state.setActiveCompany)
  const clearActiveCompany = useCompanyStore((state) => state.clearActiveCompany)

  const activeCompany = companies?.find((company) => company.id === activeCompanyId) ?? null

  const [menuOpen, setMenuOpen] = useState(false)
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const companyMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen && !companyMenuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
      if (companyMenuRef.current && !companyMenuRef.current.contains(event.target as Node)) {
        setCompanyMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen, companyMenuOpen])

  function handleSignOut() {
    setMenuOpen(false)
    clearActiveCompany()
    logout()
    void navigate('/login', { replace: true })
  }

  function handleSwitchCompany(companyId: string) {
    setActiveCompany(companyId)
    setCompanyMenuOpen(false)
    void navigate('/', { replace: true })
  }

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
        {/* Company switcher */}
        <div className="relative" ref={companyMenuRef}>
          <button
            type="button"
            onClick={() => setCompanyMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={companyMenuOpen}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Building2 className="h-5 w-5" strokeWidth={1.75} />
            <span className="hidden sm:inline">{activeCompany?.name ?? 'Select Company'}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {companyMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white text-ink shadow-lg"
            >
              <p className="px-4 pt-3 pb-2 text-xs font-bold uppercase tracking-wide text-muted">
                Switch Company
              </p>

              <div className="max-h-72 overflow-y-auto">
                {(companies ?? []).map((company) => {
                  const isActive = company.id === activeCompanyId
                  return (
                    <button
                      key={company.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSwitchCompany(company.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Building2 className="h-4 w-4 text-brand" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {company.name}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {company.industry} • {company.activeEmployeeCount} employees
                        </span>
                      </span>
                      {isActive && <Check className="h-4 w-4 text-brand" strokeWidth={2.5} />}
                    </button>
                  )
                })}
              </div>

              <div className="border-t border-slate-100" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setCompanyMenuOpen(false)
                  setShowCreate(true)
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-brand hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <Plus className="h-4 w-4 text-brand" strokeWidth={2} />
                </span>
                Create New Company
              </button>
            </div>
          )}
        </div>

        <button className="text-slate-300 hover:text-white">
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button className="text-slate-300 hover:text-white">
          <Settings className="h-5 w-5" strokeWidth={1.75} />
        </button>

        {/* Profile menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <img
              src={user?.avatarUrl ?? 'https://i.pravatar.cc/80?img=47'}
              alt="User avatar"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-ink shadow-lg"
            >
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-ink">{user?.name ?? 'User'}</p>
                <p className="mt-0.5 truncate text-xs text-muted">{user?.email ?? ''}</p>
              </div>

              <div className="border-t border-slate-100" />

              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
                Profile Settings
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateCompanyModal
          onClose={() => setShowCreate(false)}
          onCreated={(companyId) => handleSwitchCompany(companyId)}
        />
      )}
    </header>
  )
}
