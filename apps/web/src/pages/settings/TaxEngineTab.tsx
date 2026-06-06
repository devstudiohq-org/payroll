import { useState } from 'react';

export function TaxEngineTab() {
  const [taxFreeThreshold, setTaxFreeThreshold] = useState('');
  const [nisRate, setNisRate] = useState('');
  const [standardTaxRate, setStandardTaxRate] = useState('');
  const [highEarnerTaxRate, setHighEarnerTaxRate] = useState('');

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Tax Configuration</h2>
      <p className="mt-1 text-sm text-muted">
        Configure tax thresholds, NIS rates, and holiday rules
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Tax-Free Threshold" value={taxFreeThreshold} onChange={setTaxFreeThreshold} />
        <Field label="NIS Rate (%)" value={nisRate} onChange={setNisRate} />
        <Field label="Standard Tax Rate (%)" value={standardTaxRate} onChange={setStandardTaxRate} />
        <Field
          label="High Earner Tax Rate (%)"
          value={highEarnerTaxRate}
          onChange={setHighEarnerTaxRate}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div>
      <label className="block text-sm font-medium text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
