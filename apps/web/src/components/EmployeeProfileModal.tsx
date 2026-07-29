import { useState } from 'react';
import {
  X,
  Mail,
  CreditCard,
  PieChart,
  Pencil,
  Plus,
  Trash2,
  Check,
  Loader2,
} from 'lucide-react';
import type { EmployeeDto, EmploymentType, EmployeeDeductionDto } from '@starter/types';
import { useUpdateEmployee } from '../hooks/useEmployees';

const DEDUCTION_TYPES = [
  'Health Insurance',
  'Pension',
  'Union Dues',
  'Loan Repayment',
  'Other',
];

interface EmployeeProfileModalProps {
  employee: EmployeeDto;
  onClose: () => void;
}

/** Get initials for avatar */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Styling helper for Employment Type badges */
function getEmploymentTypeBadgeClass(type: EmploymentType = 'Full-time') {
  switch (type) {
    case 'Full-time':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Part-time':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Intern':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Contractor':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

interface DraftDeduction {
  type: string;
  amount: string;
}

export function EmployeeProfileModal({ employee, onClose }: EmployeeProfileModalProps) {
  const { mutateAsync: updateEmployee, isPending: isSaving } = useUpdateEmployee(employee.companyId);

  const [currentEmployee, setCurrentEmployee] = useState<EmployeeDto>(employee);
  const [isEditingDeductions, setIsEditingDeductions] = useState(false);
  const [draftDeductions, setDraftDeductions] = useState<DraftDeduction[]>([]);

  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');

  async function handleSaveSalary() {
    const newSalary = Number(salaryInput) || 0;
    try {
      const updated = await updateEmployee({
        employeeId: currentEmployee.id,
        input: { salary: newSalary },
      });
      setCurrentEmployee(updated);
    } catch {
      setCurrentEmployee((prev) => ({ ...prev, salary: newSalary }));
    }
    setIsEditingSalary(false);
  }

  // YTD Base Salary calculation (annualized / projected for full year or ytd)
  const monthlySalary = currentEmployee.salary || 0;
  const ytdSalary = monthlySalary * 12; // Standard YTD projection

  // YTD Statutory Tax Calculations
  const nisYtd = ytdSalary * 0.03; // 3% NIS
  const nhtYtd = ytdSalary * 0.02; // 2% NHT
  const eduTaxYtd = ytdSalary * 0.0225; // 2.25% Education Tax
  const totalStatutoryYtd = nisYtd + nhtYtd + eduTaxYtd;

  const deductionsList = currentEmployee.deductions && currentEmployee.deductions.length > 0
    ? currentEmployee.deductions
    : [];
  const totalDeductionsMonthly = deductionsList.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const displayStartDate = (() => {
    if (!currentEmployee.startDate) {
      return new Date(currentEmployee.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(currentEmployee.startDate.trim());
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    return new Date(currentEmployee.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  })();

  function handleStartEditingDeductions() {
    setDraftDeductions(
      deductionsList.map((d) => ({
        type: d.type,
        amount: d.amount ? String(d.amount) : '',
      })),
    );
    setIsEditingDeductions(true);
  }

  function handleAddDraftDeduction() {
    setDraftDeductions((prev) => [...prev, { type: 'Loan Repayment', amount: '' }]);
  }

  function handleUpdateDraftDeduction(index: number, patch: Partial<DraftDeduction>) {
    setDraftDeductions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function handleRemoveDraftDeduction(index: number) {
    setDraftDeductions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveDeductions() {
    const cleaned = draftDeductions.map((d) => ({
      type: d.type.trim() || 'Deduction',
      amount: Number(d.amount) || 0,
    }));

    try {
      const updated = await updateEmployee({
        employeeId: currentEmployee.id,
        input: { deductions: cleaned },
      });
      setCurrentEmployee(updated);
      setIsEditingDeductions(false);
    } catch {
      // Local fallback in case of network issue
      setCurrentEmployee((prev) => ({ ...prev, deductions: cleaned }));
      setIsEditingDeductions(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="relative border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 text-brand font-bold flex items-center justify-center text-lg border-2 border-white shadow-sm">
              {getInitials(currentEmployee.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{currentEmployee.name}</h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    currentEmployee.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {currentEmployee.status}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{currentEmployee.role}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Key Information Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                Employment Type
              </span>
              <span
                className={`mt-1.5 inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getEmploymentTypeBadgeClass(
                  currentEmployee.employmentType,
                )}`}
              >
                {currentEmployee.employmentType || 'Full-time'}
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                  Base Salary
                </span>
                {!isEditingSalary && (
                  <button
                    type="button"
                    onClick={() => {
                      setSalaryInput(monthlySalary ? String(monthlySalary) : '');
                      setIsEditingSalary(true);
                    }}
                    className="text-slate-400 hover:text-brand transition-colors cursor-pointer"
                    title="Edit Base Salary"
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </div>
              {!isEditingSalary ? (
                <span className="mt-1 block text-sm font-bold text-slate-900">
                  ${monthlySalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              ) : (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <span className="absolute left-2 top-1 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0"
                      value={salaryInput}
                      onChange={(e) => setSalaryInput(e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white pl-5 pr-2 py-0.5 text-xs font-bold text-slate-900 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSaveSalary()}
                    disabled={isSaving}
                    className="rounded bg-brand px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingSalary(false)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                Start Date
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-800">
                {displayStartDate}
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                TRN
              </span>
              <span className="mt-1 block text-sm font-medium text-slate-700 font-mono">
                {currentEmployee.trn}
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                NIS
              </span>
              <span className="mt-1 block text-sm font-medium text-slate-700 font-mono">
                {currentEmployee.nis}
              </span>
            </div>
          </div>

          {/* Email Info */}
          {currentEmployee.email && (
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 px-4 py-3 bg-white text-sm text-slate-600">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="font-medium text-slate-500">Email:</span>
              <span className="text-slate-900 font-medium">{currentEmployee.email}</span>
            </div>
          )}

          {/* Deductions Breakdown */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Deductions Breakdown
                </h3>
              </div>

              {!isEditingDeductions ? (
                <button
                  type="button"
                  onClick={handleStartEditingDeductions}
                  className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              ) : (
                <span className="text-xs font-medium text-slate-400">Editing Mode</span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {!isEditingDeductions ? (
                <>
                  {deductionsList.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">
                      No custom deductions configured for this employee.
                    </p>
                  ) : (
                    deductionsList.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">{item.type}</span>
                        <span className="text-slate-900 font-medium">
                          ${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Total Monthly Deductions</span>
                    <span className="text-brand">
                      ${totalDeductionsMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                /* Inline Edit Mode */
                <div className="space-y-3">
                  {draftDeductions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No deductions. Click "+ Add Deduction" below.</p>
                  ) : (
                    draftDeductions.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <select
                          value={item.type}
                          onChange={(e) =>
                            handleUpdateDraftDeduction(index, { type: e.target.value })
                          }
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-brand focus:outline-none"
                        >
                          {DEDUCTION_TYPES.map((dt) => (
                            <option key={dt} value={dt}>
                              {dt}
                            </option>
                          ))}
                        </select>

                        <div className="relative w-36">
                          <span className="absolute left-3 top-1.5 text-sm text-slate-400">$</span>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            value={item.amount}
                            onChange={(e) =>
                              handleUpdateDraftDeduction(index, {
                                amount: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-3 py-1.5 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveDraftDeduction(index)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label="Remove deduction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleAddDraftDeduction}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      Add Deduction
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingDeductions(false)}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSaveDeductions()}
                        disabled={isSaving}
                        className="flex items-center gap-1 rounded-md bg-brand px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        {isSaving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Check size={13} />
                        )}
                        {isSaving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Year to Date (YTD) Statutory Summary */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 overflow-hidden p-4">
            <div className="flex items-center gap-2 mb-3">
              <PieChart size={16} className="text-brand" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand">
                Year to Date (YTD) Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">YTD Gross Salary</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  ${ytdSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">NIS YTD (3%)</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  ${nisYtd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">NHT YTD (2%)</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  ${nhtYtd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Education Tax YTD (2.25%)</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  ${eduTaxYtd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Statutory Taxes YTD</span>
              <span className="text-brand">
                ${totalStatutoryYtd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
