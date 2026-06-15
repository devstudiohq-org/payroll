import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Building2, Loader2, Plus } from 'lucide-react';
import type { CompanyDto } from '@starter/types';

import { CreateCompanyModal } from '../components/CreateCompanyModal';
import { useCompanies } from '../hooks/useCompanies';
import { useCompanyStore } from '../store/company-store';
import { formatNumber } from '../lib/format';

export function SelectCompanyPage() {
  const navigate = useNavigate();
  const { data: companies, isPending, isError, refetch } = useCompanies();
  const setActiveCompany = useCompanyStore((state) => state.setActiveCompany);
  const [showCreate, setShowCreate] = useState(false);

  function handleSelect(companyId: string) {
    setActiveCompany(companyId);
    void navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-canvas px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <Building2 className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <span className="text-3xl font-bold text-ink">Payroll</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink">Select a Company</h1>
          <p className="mt-1 text-sm text-muted">
            Choose which company you want to manage payroll for
          </p>
        </div>

        {isError ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" strokeWidth={1.75} />
            </span>
            <h2 className="mt-5 text-lg font-bold text-ink">Couldn't load companies</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Make sure the API is running, then try again — or create your first company.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Create New Company
              </button>
            </div>
          </div>
        ) : isPending ? (
          <div className="mt-16 flex justify-center text-muted">
            <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {/* Create new company tile */}
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center transition-colors hover:border-brand"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
                <Plus className="h-7 w-7 text-brand" strokeWidth={2} />
              </span>
              <div>
                <p className="text-lg font-bold text-ink">Create New Company</p>
                <p className="mt-1 text-sm text-muted">Set up a new company profile</p>
              </div>
            </button>

            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateCompanyModal
          onClose={() => setShowCreate(false)}
          onCreated={(companyId) => handleSelect(companyId)}
        />
      )}
    </div>
  );
}

function CompanyCard({
  company,
  onSelect,
}: {
  company: CompanyDto;
  onSelect: (companyId: string) => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Building2 className="h-6 w-6 text-brand" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-ink">{company.name}</h3>
          <p className="text-sm text-muted">{company.industry}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <Row label="TRN:" value={company.trn} />
        <Row label="NIS:" value={company.nis} />
        <Row label="Employees:" value={formatNumber(company.employeeCount)} bold />
      </dl>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onSelect(company.id)}
          className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-brand hover:text-blue-700"
        >
          Select Company
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={bold ? 'font-bold text-ink' : 'font-medium text-ink'}>{value}</dd>
    </div>
  );
}
