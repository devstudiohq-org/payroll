import { useState } from 'react';
import { Search, Plus, FileText, ChevronDown } from 'lucide-react';
import { complianceReports } from '../data/compliance';
import ComplianceTable from '../components/ComplianceTable';

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Filter compliance reports based on search query and report type
  const filteredReports = complianceReports.filter((report) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = report.period.toLowerCase().includes(query);

    let matchesType = true;
    if (selectedType !== 'All') {
      matchesType = report.reportType === selectedType;
    }

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Compliance</h1>
          <p className="mt-1 text-sm text-muted">SO1 and P24 compliance reports for Acme Industries</p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Generate Report
        </button>
      </div>

      {/* Info Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SO1 Card */}
        <div className="bg-blue-50/20 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200/50">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">SO1 File</h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
              Monthly tax deduction report for employee income tax
            </p>
          </div>
        </div>

        {/* P24 Card */}
        <div className="bg-purple-50/20 border border-purple-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 border border-purple-200/50">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">P24 Report</h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
              Year-end summary of all tax deductions for the fiscal year
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 h-[52px] border border-slate-200 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand rounded-xl flex items-center px-4 bg-white transition-all">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by period..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 w-full bg-transparent border-none outline-none text-sm text-ink placeholder:text-slate-400"
            />
          </div>

          <div className="relative w-full sm:w-[200px] h-[52px] border border-slate-200 rounded-xl bg-white flex items-center px-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-600 appearance-none cursor-pointer pr-8"
            >
              <option value="All">All Types</option>
              <option value="SO1 File">SO1 File</option>
              <option value="P24 File">P24 File</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <ComplianceTable
        reports={filteredReports}
        totalReportsCount={complianceReports.length}
        searchQuery={searchQuery}
        selectedType={selectedType}
      />
    </div>
  );
}
