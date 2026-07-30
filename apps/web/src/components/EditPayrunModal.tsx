import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import type { CompanyDto, PayAdjustment, PayrollRunDto, PayslipLine } from '@starter/types';
import { computePayslipLine } from '@starter/types';

import { usePayslips, useUpdatePayslip } from '../hooks/usePayslips';
import { useTaxConfig } from '../hooks/useTaxConfig';
import { formatCurrency } from '../lib/format';

interface Draft {
  additions: PayAdjustment[];
  customDeductions: PayAdjustment[];
}

interface EditPayrunModalProps {
  company: CompanyDto;
  run: PayrollRunDto;
  onClose: () => void;
}

const ADDITION_PRESETS = ['Overtime', 'Bonus', 'Allowance'];
const DEDUCTION_PRESETS = ['Pension', 'Life Insurance', 'Health Insurance', 'Loan'];

export function EditPayrunModal({ company, run, onClose }: EditPayrunModalProps) {
  const { data: lines, isPending } = usePayslips(company.id, run.id);
  const { data: taxConfig } = useTaxConfig(company.id);
  const { mutateAsync, isPending: isSaving } = useUpdatePayslip(company.id, run.id);

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [error, setError] = useState<string | null>(null);

  // Seed editable drafts from the stored lines once they load.
  useEffect(() => {
    if (!lines) return;
    const seeded: Record<string, Draft> = {};
    for (const line of lines) {
      if (line.id) {
        seeded[line.id] = {
          additions: line.additions.map((a) => ({ ...a })),
          customDeductions: line.customDeductions.map((d) => ({ ...d })),
        };
      }
    }
    setDrafts(seeded);
  }, [lines]);

  function setDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id]!, ...patch } }));
  }

  function previewNet(line: PayslipLine): PayslipLine {
    const draft = line.id ? drafts[line.id] : undefined;
    if (!draft || !taxConfig) return line;
    return computePayslipLine(
      { employeeId: line.employeeId, name: line.name, role: line.role, trn: line.trn, nis: line.nis },
      line.baseGross,
      draft.additions,
      draft.customDeductions,
      taxConfig,
    );
  }

  async function handleSave() {
    setError(null);
    try {
      await Promise.all(
        Object.entries(drafts).map(([payslipId, draft]) =>
          mutateAsync({
            payslipId,
            input: {
              additions: draft.additions.filter((a) => a.label.trim() && a.amount > 0),
              customDeductions: draft.customDeductions.filter((d) => d.label.trim() && d.amount > 0),
            },
          }),
        ),
      );
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save adjustments');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-ink">Edit Payroll Run</h2>
            <p className="mt-0.5 text-sm text-muted">
              {run.period} • adjust overtime and deductions per employee
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isPending ? (
            <div className="flex justify-center py-10 text-muted">
              <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
            </div>
          ) : (lines ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              This run has no payslip lines to edit.
            </p>
          ) : (
            <div className="space-y-5">
              {(lines ?? []).map((line) => {
                const id = line.id!;
                const draft = drafts[id];
                const preview = previewNet(line);
                return (
                  <div key={id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{line.name}</p>
                        <p className="text-xs text-muted">
                          {line.role} • Base {formatCurrency(line.baseGross)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-muted">Net Pay</p>
                        <p className="text-lg font-bold text-emerald-600">
                          {formatCurrency(preview.netPay)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <AdjustmentEditor
                        title="Additions (taxable)"
                        presets={ADDITION_PRESETS}
                        items={draft?.additions ?? []}
                        onChange={(additions) => setDraft(id, { additions })}
                      />
                      <AdjustmentEditor
                        title="Other Deductions"
                        presets={DEDUCTION_PRESETS}
                        items={draft?.customDeductions ?? []}
                        onChange={(customDeductions) => setDraft(id, { customDeductions })}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                      <span>Gross: {formatCurrency(preview.grossPay)}</span>
                      <span>PAYE: {formatCurrency(preview.incomeTax)}</span>
                      <span>NIS: {formatCurrency(preview.nisDeduction)}</span>
                      <span>NHT: {formatCurrency(preview.nhtDeduction)}</span>
                      <span>EDTAX: {formatCurrency(preview.edtaxDeduction)}</span>
                      <span>Deductions: {formatCurrency(preview.totalDeductions)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving || isPending}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdjustmentEditor({
  title,
  presets,
  items,
  onChange,
}: {
  title: string;
  presets: string[];
  items: PayAdjustment[];
  onChange: (items: PayAdjustment[]) => void;
}) {
  function update(index: number, patch: Partial<PayAdjustment>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function add(label = '') {
    onChange([...items, { label, amount: 0 }]);
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink">{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item.label}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder="Label"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <input
              type="number"
              min={0}
              value={item.amount || ''}
              onChange={(e) => update(index, { amount: Number(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-slate-400 hover:text-red-600"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => add(preset)}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
