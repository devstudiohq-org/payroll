import { formatCurrency } from '../../lib/format';

interface Deduction {
  id: string;
  type: string;
  calculation: string;
  defaultAmount: number;
}

export function DeductionsTab() {
  // Deduction types come from the database once configured.
  const deductions: Deduction[] = [];

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Deductions Library</h2>
      <p className="mt-1 text-sm text-muted">Manage standard deduction types and default amounts</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3.5">Deduction Type</th>
                <th className="px-6 py-3.5">Calculation</th>
                <th className="px-6 py-3.5 text-right">Default Amount</th>
              </tr>
            </thead>
            <tbody>
              {deductions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-muted">
                    No deduction types configured yet.
                  </td>
                </tr>
              ) : (
                deductions.map((deduction) => (
                  <tr key={deduction.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 text-ink">{deduction.type}</td>
                    <td className="px-6 py-4 text-ink">{deduction.calculation}</td>
                    <td className="px-6 py-4 text-right font-medium text-ink">
                      {formatCurrency(deduction.defaultAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
