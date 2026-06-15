import { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import type { CompanyMemberRole, CreateCompanyInput } from '@starter/types';

import { useCreateCompany } from '../hooks/useCompanies';

const INDUSTRIES = [
  'Manufacturing',
  'Technology',
  'Retail',
  'Healthcare',
  'Finance',
  'Hospitality',
  'Construction',
  'Education',
  'Other',
];

const MEMBER_ROLES: CompanyMemberRole[] = ['Admin', 'Manager', 'Viewer'];

interface MemberDraft {
  fullName: string;
  email: string;
  role: CompanyMemberRole;
}

const emptyMember: MemberDraft = { fullName: '', email: '', role: 'Admin' };

interface CreateCompanyModalProps {
  onClose: () => void;
  onCreated?: (companyId: string) => void;
}

export function CreateCompanyModal({ onClose, onCreated }: CreateCompanyModalProps) {
  const { mutateAsync, isPending } = useCreateCompany();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [address, setAddress] = useState('');
  const [trn, setTrn] = useState('');
  const [nis, setNis] = useState('');
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState<MemberDraft[]>([{ ...emptyMember }]);
  const [error, setError] = useState<string | null>(null);

  function updateMember(index: number, patch: Partial<MemberDraft>) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function addMember() {
    setMembers((prev) => [...prev, { ...emptyMember }]);
  }

  function removeMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload: CreateCompanyInput = {
      name: name.trim(),
      industry,
      employeeCount: Number(employeeCount) || 0,
      address: address.trim(),
      trn: trn.trim(),
      nis: nis.trim(),
      email: email.trim(),
      members: members
        .filter((m) => m.fullName.trim() && m.email.trim())
        .map((m) => ({ fullName: m.fullName.trim(), email: m.email.trim(), role: m.role })),
    };

    try {
      const company = await mutateAsync(payload);
      onCreated?.(company.id);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create company');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-ink">Create New Company</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-ink">Company Details</h3>

            <div className="mt-4 space-y-4">
              <Field label="Company Name" required>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Acme Corporation"
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Industry" required>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select an industry
                    </option>
                    {INDUSTRIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Number of Employees" required>
                  <input
                    type="number"
                    min={0}
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    required
                    placeholder="e.g., 50"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Address" required>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="e.g., 123 Main Street, Kingston, Jamaica"
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="TRN (Tax Registration Number)" required>
                  <input
                    value={trn}
                    onChange={(e) => setTrn(e.target.value)}
                    required
                    placeholder="e.g., 100123456"
                    className={inputClass}
                  />
                </Field>

                <Field label="NIS Number" required>
                  <input
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    required
                    placeholder="e.g., NIS-001-2345"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Company Email" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g., payroll@acme.com"
                  className={inputClass}
                />
              </Field>

              <div>
                <label className="block text-sm font-medium text-ink">Company Logo (Optional)</label>
                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-slate-50">
                  <Upload className="h-4 w-4" strokeWidth={1.75} />
                  Upload Logo
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>

            {/* Team Members */}
            <div className="mt-8 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink">Team Members</h3>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add Member
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {members.map((member, index) => (
                <div key={index} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">Member {index + 1}</p>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-slate-400 hover:text-red-600"
                        aria-label={`Remove member ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Full Name">
                      <input
                        value={member.fullName}
                        onChange={(e) => updateMember(index, { fullName: e.target.value })}
                        placeholder="John Smith"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, { email: e.target.value })}
                        placeholder="john@company.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field label="Role">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          updateMember(index, { role: e.target.value as CompanyMemberRole })
                        }
                        className={inputClass}
                      >
                        {MEMBER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Creating…' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
