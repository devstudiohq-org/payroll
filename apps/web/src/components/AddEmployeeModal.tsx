import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, X, ChevronDown } from 'lucide-react';
import type { CreateEmployeeInput, EmployeeStatus, EmploymentType } from '@starter/types';

import { useCreateEmployee } from '../hooks/useEmployees';

const DEPARTMENTS = [
  'Operations',
  'Finance',
  'Engineering',
  'Product',
  'Sales',
  'Marketing',
  'Human Resources',
  'Customer Support',
  'Legal',
  'Production',
  'Warehouse',
  'Other',
];



const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Intern', 'Contractor'];

const DEDUCTION_TYPES = [
  'Health Insurance',
  'Pension',
  'Union Dues',
  'Loan Repayment',
  'Other',
];

const ALLOWANCE_TYPES = [
  'Housing',
  'Transportation',
  'Meal',
  'Tech Allowance',
  'Education',
  'Other',
];

interface AllowanceDraft {
  type: string;
  amount: string;
}

interface DeductionDraft {
  type: string;
  amount: string;
}

interface AddEmployeeModalProps {
  companyId: string;
  onClose: () => void;
  onCreated?: () => void;
}

export function AddEmployeeModal({ companyId, onClose, onCreated }: AddEmployeeModalProps) {
  const { mutateAsync, isPending } = useCreateEmployee(companyId);

  // Personal Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [trn, setTrn] = useState('');
  const [nis, setNis] = useState('');

  // Employment Details
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');

  // Allowances & Deductions
  const [allowances, setAllowances] = useState<AllowanceDraft[]>([]);
  const [deductions, setDeductions] = useState<DeductionDraft[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Allowance helpers
  function addAllowance() {
    setAllowances((prev) => [...prev, { type: 'Housing', amount: '0' }]);
  }
  function updateAllowance(index: number, patch: Partial<AllowanceDraft>) {
    setAllowances((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  }
  function removeAllowance(index: number) {
    setAllowances((prev) => prev.filter((_, i) => i !== index));
  }

  // Deduction helpers
  function addDeduction() {
    setDeductions((prev) => [...prev, { type: 'Health Insurance', amount: '' }]);
  }
  function updateDeduction(index: number, patch: Partial<DeductionDraft>) {
    setDeductions((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }
  function removeDeduction(index: number) {
    setDeductions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Build the role from department + position
    const role = position.trim() || department;

    const payload: CreateEmployeeInput = {
      name: fullName.trim(),
      role,
      email: email.trim() || undefined,
      trn: trn.trim(),
      nis: nis.trim(),
      salary: Number(baseSalary) || 0,
      status: 'Active' as EmployeeStatus,
      employmentType,
      startDate: startDate ? startDate : undefined,
      deductions: deductions
        .filter((d) => d.type.trim())
        .map((d) => ({ type: d.type.trim(), amount: Number(d.amount) || 0 })),
    };

    try {
      await mutateAsync(payload);
      onCreated?.();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to add employee');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-ink">Add New Employee</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* ── Personal Details ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink">
                Personal Details
              </h3>

              <div className="mt-4 space-y-4">
                <Field label="Full Name" required>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g., Marlon Thompson"
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email" required>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g., marlon@company.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Start Date" required>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="TRN" required>
                    <input
                      value={trn}
                      onChange={(e) => setTrn(e.target.value)}
                      required
                      placeholder="e.g., 123-456-789"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="NIS" required>
                    <input
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      required
                      placeholder="e.g., 987654321"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* ── Employment Details ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink">
                Employment Details
              </h3>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Department" required>
                    <Dropdown
                      value={department}
                      onChange={setDepartment}
                      options={DEPARTMENTS}
                      placeholder="Select department"
                      required
                    />
                  </Field>

                  <Field label="Position" required>
                    <input
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                      placeholder="e.g., Operations Manager"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Base Salary" required>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      required
                      placeholder="e.g., 85000"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Employment Type" required>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                      required
                      className={inputClass}
                    >
                      {EMPLOYMENT_TYPES.map((et) => (
                        <option key={et} value={et}>
                          {et}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </section>

            {/* ── Allowances ── */}
            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-ink">Allowances</h3>
                <button
                  type="button"
                  onClick={addAllowance}
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  Add Allowance
                </button>
              </div>

              {allowances.length > 0 && (
                <div className="mt-4 space-y-3">
                  {allowances.map((allowance, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-ink">Allowance</p>
                        <button
                          type="button"
                          onClick={() => removeAllowance(index)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                          aria-label={`Remove allowance ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Type">
                          <select
                            value={allowance.type}
                            onChange={(e) => updateAllowance(index, { type: e.target.value })}
                            className={inputClass}
                          >
                            {ALLOWANCE_TYPES.map((at) => (
                              <option key={at} value={at}>
                                {at}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Amount">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={allowance.amount}
                            onChange={(e) => updateAllowance(index, { amount: e.target.value })}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Deductions ── */}
            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-ink">Deductions</h3>
                <button
                  type="button"
                  onClick={addDeduction}
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  Add Deduction
                </button>
              </div>

              {deductions.length > 0 && (
                <div className="mt-4 space-y-3">
                  {deductions.map((deduction, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-ink">Deduction</p>
                        <button
                          type="button"
                          onClick={() => removeDeduction(index)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                          aria-label={`Remove deduction ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Type">
                          <select
                            value={deduction.type}
                            onChange={(e) => updateDeduction(index, { type: e.target.value })}
                            className={inputClass}
                          >
                            {DEDUCTION_TYPES.map((dt) => (
                              <option key={dt} value={dt}>
                                {dt}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Amount">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={deduction.amount}
                            onChange={(e) => updateDeduction(index, { amount: e.target.value })}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPending ? 'Adding…' : 'Add Employee'}
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

function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Hidden input for native form validation */}
      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={() => {}}
          required
          className="absolute inset-0 opacity-0 pointer-events-none"
        />
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputClass} flex items-center justify-between cursor-pointer ${
          open ? 'border-brand ring-1 ring-brand' : ''
        }`}
      >
        <span className={value ? 'text-ink' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:text-brand transition-colors cursor-pointer ${
                  value === option ? 'bg-blue-50 text-brand font-medium' : 'text-ink'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
