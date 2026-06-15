import { useMemo, useState } from 'react';
import { ArrowRight, Building2, Check, Loader2, Plus, Search } from 'lucide-react';
import type { CompanyDto } from '@starter/types';

import { CreateCompanyModal } from '../../components/CreateCompanyModal';
import { useCompanies } from '../../hooks/useCompanies';
import { useCompanyStore } from '../../store/company-store';
import { formatNumber } from '../../lib/format';

export function CompaniesTab() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: companies, isPending } = useCompanies();
  const activeCompanyId = useCompanyStore((state) => state.activeCompanyId);
  const setActiveCompany = useCompanyStore((state) => state.setActiveCompany);

  const activeCompany = companies?.find((company) => company.id === activeCompanyId) ?? null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies ?? [];
    return (companies ?? []).filter(
      (company) =>
        company.name.toLowerCase().includes(query) || company.trn.toLowerCase().includes(query),
    );
  }, [companies, search]);

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Company Management</h2>
      <p className="mt-1 text-sm text-muted">
        Manage multi-tenant company profiles and switch between companies
      </p>

      {/* Currently active company */}
      <div className="mt-5 flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <Building2 className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink">Currently Active Company</p>
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              Active
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted">{activeCompany?.name ?? 'No company selected'}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search companies by name or TRN..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      {/* Company grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors hover:border-brand"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Plus className="h-6 w-6 text-brand" strokeWidth={2} />
          </span>
          <div>
            <p className="font-semibold text-ink">Create New Company</p>
            <p className="mt-1 text-sm text-muted">Add a new company to manage payroll</p>
          </div>
        </button>

        {isPending ? (
          <div className="flex min-h-56 items-center justify-center text-muted">
            <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
          </div>
        ) : (
          filtered.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              active={company.id === activeCompanyId}
              onSwitch={() => setActiveCompany(company.id)}
            />
          ))
        )}
      </div>

      {showCreate && <CreateCompanyModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function CompanyCard({
  company,
  active,
  onSwitch,
}: {
  company: CompanyDto;
  active: boolean;
  onSwitch: () => void;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border bg-white p-5 ${
        active ? 'border-brand' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            active ? 'bg-blue-100' : 'bg-slate-100'
          }`}
        >
          <Building2
            className={`h-6 w-6 ${active ? 'text-blue-600' : 'text-slate-500'}`}
            strokeWidth={1.75}
          />
        </span>
        {active && (
          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Active
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold text-ink">{company.name}</h3>
      <p className="text-sm text-muted">{company.industry}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <DetailRow label="TRN:" value={company.trn} />
        <DetailRow label="NIS:" value={company.nis} />
        <DetailRow label="Employees:" value={formatNumber(company.employeeCount)} bold />
      </dl>

      <div className="mt-4 border-t border-slate-100 pt-4">
        {active ? (
          <p className="text-center text-sm font-medium text-brand">Currently Active</p>
        ) : (
          <button
            type="button"
            onClick={onSwitch}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90"
          >
            Switch to this company
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={bold ? 'font-semibold text-ink' : 'text-ink'}>{value}</dd>
    </div>
  );
}
