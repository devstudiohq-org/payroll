import { useState } from 'react';

export function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [auditLogging, setAuditLogging] = useState(false);

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Security &amp; Access</h2>
      <p className="mt-1 text-sm text-muted">
        Configure role-based access control and security settings
      </p>

      <div className="mt-6 space-y-4">
        <ToggleRow
          title="Two-Factor Authentication"
          description="Require 2FA for all admin users"
          enabled={twoFactor}
          onChange={setTwoFactor}
        />
        <ToggleRow
          title="Audit Logging"
          description="Track all payroll operations and changes"
          enabled={auditLogging}
          onChange={setAuditLogging}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={() => onChange(!enabled)}
        className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${
          enabled ? 'bg-brand' : 'bg-slate-300'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
