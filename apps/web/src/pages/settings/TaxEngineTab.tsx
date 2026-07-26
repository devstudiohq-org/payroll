import { useEffect, useState } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import type { UpsertTaxConfigInput } from '@starter/types';

import { useCompanyStore } from '../../store/company-store';
import { useSaveTaxConfig, useTaxConfig } from '../../hooks/useTaxConfig';

type FormState = Record<keyof UpsertTaxConfigInput, string>;

const EMPTY_FORM: FormState = {
  taxFreeThreshold: '',
  highEarnerThreshold: '',
  standardTaxRate: '',
  highEarnerTaxRate: '',
  nisRate: '',
  nhtRate: '',
  edtaxRate: '',
};

export function TaxEngineTab() {
  const activeCompanyId = useCompanyStore((state) => state.activeCompanyId);
  const { data: config, isPending } = useTaxConfig(activeCompanyId);
  const { mutateAsync, isPending: isSaving } = useSaveTaxConfig(activeCompanyId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Populate the form once the company's saved configuration loads.
  useEffect(() => {
    if (!config) return;
    setForm({
      taxFreeThreshold: config.isDefault ? '' : String(config.taxFreeThreshold),
      highEarnerThreshold: config.isDefault ? '' : String(config.highEarnerThreshold),
      standardTaxRate: config.isDefault ? '' : String(config.standardTaxRate),
      highEarnerTaxRate: config.isDefault ? '' : String(config.highEarnerTaxRate),
      nisRate: config.isDefault ? '' : String(config.nisRate),
      nhtRate: config.isDefault ? '' : String(config.nhtRate),
      edtaxRate: config.isDefault ? '' : String(config.edtaxRate),
    });
  }, [config]);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setError(null);
    const payload: UpsertTaxConfigInput = {
      taxFreeThreshold: Number(form.taxFreeThreshold) || 0,
      highEarnerThreshold: Number(form.highEarnerThreshold) || 0,
      standardTaxRate: Number(form.standardTaxRate) || 0,
      highEarnerTaxRate: Number(form.highEarnerTaxRate) || 0,
      nisRate: Number(form.nisRate) || 0,
      nhtRate: Number(form.nhtRate) || 0,
      edtaxRate: Number(form.edtaxRate) || 0,
    };

    try {
      await mutateAsync(payload);
      setSaved(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save configuration');
    }
  }

  if (!activeCompanyId) {
    return <p className="text-sm text-muted">Select a company to configure its tax engine.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Tax Configuration</h2>
          <p className="mt-1 text-sm text-muted">
            Configure tax thresholds, NIS/NHT/Education Tax rates. These apply to this company only.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving || isPending}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : saved ? (
            <Check className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Save className="h-4 w-4" strokeWidth={2} />
          )}
          {isSaving ? 'Saving…' : saved ? 'Saved' : 'Save Tax Settings'}
        </button>
      </div>

      {isPending ? (
        <div className="mt-8 flex justify-center text-muted">
          <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field
              label="Tax-Free Threshold"
              value={form.taxFreeThreshold}
              onChange={(v) => update('taxFreeThreshold', v)}
              placeholder="e.g., 125000"
            />
            <Field
              label="High Earner Threshold"
              value={form.highEarnerThreshold}
              onChange={(v) => update('highEarnerThreshold', v)}
              placeholder="e.g., 500000"
            />
            <Field
              label="Standard Tax Rate (%)"
              value={form.standardTaxRate}
              onChange={(v) => update('standardTaxRate', v)}
              placeholder="e.g., 25"
            />
            <Field
              label="High Earner Tax Rate (%)"
              value={form.highEarnerTaxRate}
              onChange={(v) => update('highEarnerTaxRate', v)}
              placeholder="e.g., 30"
            />
            <Field
              label="NIS Rate (%)"
              value={form.nisRate}
              onChange={(v) => update('nisRate', v)}
              placeholder="e.g., 3"
            />
            <Field
              label="NHT Rate (%)"
              value={form.nhtRate}
              onChange={(v) => update('nhtRate', v)}
              placeholder="e.g., 2"
            />
            <Field
              label="Education Tax Rate (%)"
              value={form.edtaxRate}
              onChange={(v) => update('edtaxRate', v)}
              placeholder="e.g., 2.25"
            />
          </div>

          <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-xs text-muted">
            NIS and NHT (percentages of gross) and Education Tax (on statutory income, gross − NIS)
            always apply. PAYE applies only to statutory income above the tax-free threshold at the
            standard rate, and above the high-earner threshold at the high-earner rate.
          </p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div>
      <label className="block text-sm font-medium text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
