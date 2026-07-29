import type { ElementType } from 'react';
import { useState } from 'react';
import { Building2, Calculator, Mail, Save, Shield } from 'lucide-react';

import { CompaniesTab } from './settings/CompaniesTab';
import { EmailTemplatesTab } from './settings/EmailTemplatesTab';
import { SecurityTab } from './settings/SecurityTab';
import { TaxEngineTab } from './settings/TaxEngineTab';

type TabId = 'companies' | 'tax-engine' | 'email-templates' | 'security';

const TABS: { id: TabId; label: string; icon: ElementType }[] = [
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'tax-engine', label: 'Tax Engine', icon: Calculator },
  { id: 'email-templates', label: 'Email Templates', icon: Mail },
  { id: 'security', label: 'Security', icon: Shield },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('companies');

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Settings</h1>
          <p className="mt-1 text-sm text-muted">Configure payroll system settings</p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <Save className="h-4 w-4" strokeWidth={2} />
          Save Changes
        </button>
      </div>

      {/* Tabbed panel */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = id === activeTab;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-brand bg-blue-50 text-brand'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'companies' && <CompaniesTab />}
          {activeTab === 'tax-engine' && <TaxEngineTab />}
          {activeTab === 'email-templates' && <EmailTemplatesTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </>
  );
}
