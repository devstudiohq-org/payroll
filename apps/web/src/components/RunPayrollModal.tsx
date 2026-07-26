import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useActiveCompany } from '../hooks/useActiveCompany';
import { useEmployees } from '../hooks/useEmployees';
import { useCreatePayrollRun } from '../hooks/usePayrollRuns';

interface RunPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RunPayrollModal({ isOpen, onClose, onSuccess }: RunPayrollModalProps) {
  const activeCompany = useActiveCompany();
  const { data: employees = [], isPending: isLoadingEmployees } = useEmployees(
    activeCompany?.id ?? null,
  );
  const { mutateAsync: createRun, isPending: isSavingRun } = useCreatePayrollRun(
    activeCompany?.id ?? null,
  );

  const [step, setStep] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Generate period options (current month and past 11 months)
  const periodOptions = useMemo(() => {
    const options = [];
    const date = new Date();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    for (let i = 0; i < 12; i++) {
      const m = date.getMonth();
      const y = date.getFullYear();
      options.push(`${monthNames[m]} ${y}`);
      date.setMonth(date.getMonth() - 1);
    }
    return options;
  }, []);

  // Filter to active employees
  const activeEmployees = useMemo(() => {
    return employees.filter((e) => e.status === 'Active');
  }, [employees]);

  // Calculations
  const totalGrossPay = useMemo(() => {
    return activeEmployees.reduce((sum, e) => sum + e.salary, 0);
  }, [activeEmployees]);

  const totalNis = useMemo(() => {
    // Jamaican NIS rate: ~5.5% matching the visual example
    return totalGrossPay * 0.055;
  }, [totalGrossPay]);

  const totalTax = 0.0; // Income tax is $0 in the mockup for this run

  const totalNetPay = useMemo(() => {
    return totalGrossPay - totalNis - totalTax;
  }, [totalGrossPay, totalNis, totalTax]);

  if (!isOpen) return null;

  function handleNext() {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    if (!activeCompany?.id) return;
    setError(null);

    try {
      await createRun({
        period: selectedPeriod,
        employeesCount: activeEmployees.length,
        totalGrossPay,
        totalNetPay,
        totalTax,
        totalNis,
        status: 'Completed',
      });
      onSuccess?.();
      onClose();
      // Reset state
      setStep(1);
      setSelectedPeriod('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit payroll run');
    }
  }

  const isNextDisabled =
    step === 1 && (!selectedPeriod || activeEmployees.length === 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
          <div>
            <h2 className="text-xl font-bold text-ink">Run Payroll</h2>
            <p className="text-xs font-semibold text-muted mt-1 uppercase tracking-wider">
              Step {step} of 3:{' '}
              {step === 1
                ? 'Select Period'
                : step === 2
                  ? 'Review Employees'
                  : 'Confirm & Run'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-8 pt-6 flex gap-3">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-brand' : 'bg-slate-200'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-brand' : 'bg-slate-200'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= 3 ? 'bg-brand' : 'bg-slate-200'
            }`}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  Select Payroll Period
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Choose the month for this payroll run
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="period-select"
                  className="block text-sm font-semibold text-ink"
                >
                  Payroll Period <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="period-select"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full h-[50px] appearance-none rounded-xl border border-slate-300 bg-white px-4 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
                  >
                    <option value="">Select a period</option>
                    {periodOptions.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                  <div className="absolute pointer-events-none right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-5 flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-blue-900">
                  Company: {activeCompany?.name ?? 'Loading...'}
                </span>
                {isLoadingEmployees ? (
                  <div className="flex items-center gap-2 text-xs text-blue-700/80 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Fetching employee database...
                  </div>
                ) : (
                  <span className="text-sm text-blue-700 font-medium">
                    {activeEmployees.length}{' '}
                    {activeEmployees.length === 1 ? 'active employee' : 'active employees'}{' '}
                    will be included in this payroll run
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  Review Employees
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {activeEmployees.length} {activeEmployees.length === 1 ? 'employee' : 'employees'} will be processed for {selectedPeriod}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 overflow-hidden bg-[#FAFAFA]">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 h-11 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <th className="px-6 py-2.5">Name</th>
                        <th className="px-6 py-2.5">Department</th>
                        <th className="px-6 py-2.5 text-right">Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeEmployees.map((employee) => (
                        <tr key={employee.id} className="h-[52px]">
                          <td className="px-6 py-2 text-sm font-semibold text-slate-900">
                            {employee.name}
                          </td>
                          <td className="px-6 py-2 text-slate-600 font-medium">
                            {employee.role}
                          </td>
                          <td className="px-6 py-2 text-right text-slate-600 font-semibold">
                            $
                            {employee.salary.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  Confirm Payroll Run
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Review the summary before processing
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Gross Pay
                  </span>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    $
                    {totalGrossPay.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Net Pay
                  </span>
                  <div className="mt-2 text-2xl font-bold text-emerald-600">
                    $
                    {totalNetPay.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Tax
                  </span>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    $
                    {totalTax.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total NIS
                  </span>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    $
                    {totalNis.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-5 flex flex-col gap-1">
                <span className="text-sm font-bold text-emerald-900">
                  Ready to Process
                </span>
                <span className="text-sm text-emerald-700 font-medium">
                  {activeEmployees.length} {activeEmployees.length === 1 ? 'employee' : 'employees'} • {selectedPeriod}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex h-[76px] items-center justify-between border-t border-slate-100 px-8 bg-slate-50/50">
          <button
            type="button"
            disabled={step === 1}
            onClick={handleBack}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
              step === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {step < 3 ? (
              <button
                type="button"
                disabled={isNextDisabled}
                onClick={handleNext}
                className={`flex items-center gap-1.5 rounded-xl px-5 h-[42px] text-sm font-semibold text-white transition-all cursor-pointer ${
                  isNextDisabled
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-brand hover:bg-blue-700 shadow-md shadow-brand/10 hover:shadow-brand/20'
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSavingRun}
                onClick={() => {
                  void handleSubmit();
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 h-[42px] text-sm font-semibold text-white transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 cursor-pointer"
              >

                {isSavingRun ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Run Payroll'
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
