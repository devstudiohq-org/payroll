import { useState, useRef, useEffect, type SyntheticEvent } from 'react';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import type { Employee } from '../../types/employees';

type AddEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (employee: Omit<Employee, 'id' | 'initials'>) => void | Promise<unknown>;
};

type AllowanceRow = { name: string; amount: string };
type DeductionRow = { name: string; amount: string };

const DEPARTMENTS = [
  'Select department',
  'Operations',
  'Finance',
  'Production',
  'Human Resources',
  'Marketing',
  'Engineering',
  'Sales',
];

const TAX_CODES = [
  { value: 'TC01', label: 'TC01 - Standard Rate' },
  { value: 'TC02', label: 'TC02 - Reduced Rate' },
  { value: 'TC03', label: 'TC03 - Zero Rate' },
  { value: 'TC04', label: 'TC04 - Higher Rate' },
];

type FormState = {
  name: string;
  email: string;
  startDate: string;
  trn: string;
  nis: string;
  department: string;
  position: string;
  salary: string;
  taxCode: string;
  status: 'Active' | 'Inactive';
};

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  startDate: '',
  trn: '',
  nis: '',
  department: '',
  position: '',
  salary: '',
  taxCode: 'TC01',
  status: 'Active',
};

export function AddEmployeeModal({ open, onClose, onSubmit }: AddEmployeeModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowances, setAllowances] = useState<AllowanceRow[]>([]);
  const [deductions, setDeductions] = useState<DeductionRow[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [open]);

  // Reset form on close
  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsSubmitting(false);
      setAllowances([]);
      setDeductions([]);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      newErrors.email = 'Enter a valid email address';
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.trn.trim()) newErrors.trn = 'TRN is required';
    else if (!/^\d{3}-?\d{3}-?\d{3}$/.test(form.trn.trim()))
      newErrors.trn = 'TRN must be 9 digits (e.g. 123-456-789)';
    if (!form.nis.trim()) newErrors.nis = 'NIS is required';
    if (!form.department || form.department === '') newErrors.department = 'Department is required';
    if (!form.position.trim()) newErrors.position = 'Position is required';
    if (!form.salary || Number(form.salary) <= 0) newErrors.salary = 'Enter a valid salary';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await Promise.resolve(
        onSubmit({
          name: form.name.trim(),
          email: form.email.trim(),
          startDate: form.startDate,
          role: form.position.trim(),
          department: form.department,
          trn: form.trn.trim(),
          nis: form.nis.trim(),
          salary: parseFloat(form.salary),
          taxCode: form.taxCode,
          status: form.status,
          allowances: allowances
            .filter((a) => a.name.trim() && Number(a.amount) > 0)
            .map((a) => ({ name: a.name.trim(), amount: parseFloat(a.amount) })),
          deductions: deductions
            .filter((d) => d.name.trim() && Number(d.amount) > 0)
            .map((d) => ({ name: d.name.trim(), amount: parseFloat(d.amount) })),
        }),
      );
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function addAllowance() {
    setAllowances([...allowances, { name: '', amount: '' }]);
  }

  function removeAllowance(index: number) {
    setAllowances(allowances.filter((_, i) => i !== index));
  }

  function updateAllowance(index: number, field: 'name' | 'amount', value: string) {
    const updated = [...allowances];
    updated[index] = { ...updated[index]!, [field]: value };
    setAllowances(updated);
  }

  function addDeduction() {
    setDeductions([...deductions, { name: '', amount: '' }]);
  }

  function removeDeduction(index: number) {
    setDeductions(deductions.filter((_, i) => i !== index));
  }

  function updateDeduction(index: number, field: 'name' | 'amount', value: string) {
    const updated = [...deductions];
    updated[index] = { ...updated[index]!, [field]: value };
    setDeductions(updated);
  }

  if (!open) return null;

  const inputClass = (field: string) =>
    `w-full h-[46px] px-4 rounded-lg border text-sm bg-white outline-none transition-all ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
        : 'border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand/20'
    }`;

  const selectClass = (field: string) =>
    `w-full h-[46px] px-4 rounded-lg border text-sm bg-white outline-none cursor-pointer appearance-none transition-all ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
        : 'border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand/20'
    }`;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col transform"
        style={{ animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Add New Employee</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={(e) => { void handleSubmit(e); }} className="flex-1 overflow-y-auto px-8 pb-2">
          {/* ──────── PERSONAL DETAILS ──────── */}
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Personal Details
          </h3>

          {/* Full Name — full width */}
          <div className="mb-4">
            <label htmlFor="emp-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="emp-name"
              type="text"
              placeholder="e.g., Marlon Thompson"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass('name')}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email + Start Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="emp-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="emp-email"
                type="email"
                placeholder="e.g., marlon@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="emp-start-date" className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id="emp-start-date"
                type="date"
                placeholder="dd/mm/yyyy"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={`${inputClass('startDate')} text-slate-600`}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
          </div>

          {/* TRN + NIS */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label htmlFor="emp-trn" className="block text-sm font-medium text-slate-700 mb-1.5">
                TRN <span className="text-red-500">*</span>
              </label>
              <input
                id="emp-trn"
                type="text"
                placeholder="e.g., 123-456-789"
                value={form.trn}
                onChange={(e) => setForm({ ...form, trn: e.target.value })}
                className={inputClass('trn')}
              />
              {errors.trn && <p className="text-xs text-red-500 mt-1">{errors.trn}</p>}
            </div>
            <div>
              <label htmlFor="emp-nis" className="block text-sm font-medium text-slate-700 mb-1.5">
                NIS <span className="text-red-500">*</span>
              </label>
              <input
                id="emp-nis"
                type="text"
                placeholder="e.g., 987654321"
                value={form.nis}
                onChange={(e) => setForm({ ...form, nis: e.target.value })}
                className={inputClass('nis')}
              />
              {errors.nis && <p className="text-xs text-red-500 mt-1">{errors.nis}</p>}
            </div>
          </div>

          {/* ──────── EMPLOYMENT DETAILS ──────── */}
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Employment Details
          </h3>

          {/* Department + Position */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="emp-department" className="block text-sm font-medium text-slate-700 mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="emp-department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className={`${selectClass('department')} ${
                    !form.department ? 'text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept === 'Select department' ? '' : dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>
            <div>
              <label htmlFor="emp-position" className="block text-sm font-medium text-slate-700 mb-1.5">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                id="emp-position"
                type="text"
                placeholder="e.g., Operations Manager"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className={inputClass('position')}
              />
              {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
            </div>
          </div>

          {/* Base Salary + Tax Code */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label htmlFor="emp-salary" className="block text-sm font-medium text-slate-700 mb-1.5">
                Base Salary <span className="text-red-500">*</span>
              </label>
              <input
                id="emp-salary"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 85000"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className={inputClass('salary')}
              />
              {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
            </div>
            <div>
              <label htmlFor="emp-tax-code" className="block text-sm font-medium text-slate-700 mb-1.5">
                Tax Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="emp-tax-code"
                  value={form.taxCode}
                  onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
                  className={`${selectClass('taxCode')} text-slate-900`}
                >
                  {TAX_CODES.map((tc) => (
                    <option key={tc.value} value={tc.value}>
                      {tc.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* ──────── ALLOWANCES ──────── */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Allowances
            </h3>
            <button
              type="button"
              onClick={addAllowance}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Allowance
            </button>
          </div>

          {allowances.length > 0 && (
            <div className="space-y-3 mb-4">
              {allowances.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Allowance name"
                    value={row.name}
                    onChange={(e) => updateAllowance(i, 'name', e.target.value)}
                    className="flex-1 h-[42px] px-4 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    step="0.01"
                    min="0"
                    value={row.amount}
                    onChange={(e) => updateAllowance(i, 'amount', e.target.value)}
                    className="w-[140px] h-[42px] px-4 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeAllowance(i)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ──────── DEDUCTIONS ──────── */}
          <div className="flex items-center justify-between mb-3 mt-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Deductions
            </h3>
            <button
              type="button"
              onClick={addDeduction}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Deduction
            </button>
          </div>

          {deductions.length > 0 && (
            <div className="space-y-3 mb-4">
              {deductions.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Deduction name"
                    value={row.name}
                    onChange={(e) => updateDeduction(i, 'name', e.target.value)}
                    className="flex-1 h-[42px] px-4 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    step="0.01"
                    min="0"
                    value={row.amount}
                    onChange={(e) => updateDeduction(i, 'amount', e.target.value)}
                    className="w-[140px] h-[42px] px-4 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeDeduction(i)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Spacer before footer */}
          <div className="h-4" />
        </form>

        {/* Fixed Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => { void handleSubmit(e); }}
            disabled={isSubmitting}
            className="h-11 px-6 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
