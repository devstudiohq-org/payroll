import { useState } from 'react';
import { Search, Upload, Plus, ChevronDown, MoreVertical, Users, Loader2 } from 'lucide-react';
import { useEmployees, useCreateEmployee, useCreateEmployeesBulk } from '../hooks/useEmployees';
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { BulkUploadModal } from '../components/modals/BulkUploadModal';
import type { CreateEmployeePayload } from '../api/client';

function generateInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join('');
}

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const { data: employees = [], isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const createEmployeesBulk = useCreateEmployeesBulk();

  // Filter employees based on search query and department selection
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.trn.toLowerCase().includes(query) ||
      employee.nis.toLowerCase().includes(query);

    const matchesDepartment =
      selectedDepartment === 'All' ||
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  function handleAddEmployee(data: Omit<CreateEmployeePayload, 'salary'> & { salary: number }) {
    return createEmployee.mutateAsync({
      ...data,
      salary: data.salary.toString(),
    });
  }

  function handleBulkUpload(batch: (Omit<CreateEmployeePayload, 'salary'> & { salary: number })[]) {
    return createEmployeesBulk.mutateAsync(
      batch.map((item) => ({
        ...item,
        salary: item.salary.toString(),
      })),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Employees</h1>
          <p className="mt-1 text-sm text-muted">Manage workforce</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 text-slate-400" strokeWidth={2} />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search & Filter Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 h-[52px] border border-slate-200 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand rounded-xl flex items-center px-4 bg-white transition-all">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search employees by name, email, or TRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 w-full bg-transparent border-none outline-none text-sm text-ink placeholder:text-slate-400"
            />
          </div>

          <div className="relative w-full sm:w-[220px] h-[52px] border border-slate-200 rounded-xl bg-white flex items-center px-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-600 appearance-none cursor-pointer pr-8"
            >
              <option value="All">All Departments</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance / Accounting</option>
              <option value="Production">Production</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Loader2 size={32} className="text-brand animate-spin mb-4" />
            <p className="text-sm text-slate-500 font-medium">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
              <Users size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No employees found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              {searchQuery || selectedDepartment !== 'All'
                ? 'Try adjusting your search terms or filters.'
                : 'Get started by adding your first employee.'}
            </p>
            {!searchQuery && selectedDepartment === 'All' && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Upload size={16} className="text-slate-400" />
                  Bulk Upload
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  Add Employee
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#FAFAFA] h-[60px]">
                    <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      TRN
                    </th>
                    <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((employee) => {
                    const initials = generateInitials(employee.name);
                    const salaryNum = parseFloat(employee.salary);

                    return (
                      <tr key={employee.id} className="h-[78px] hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-50 text-brand font-semibold flex items-center justify-center text-sm border border-blue-100 uppercase">
                              {initials}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{employee.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{employee.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-3 text-sm text-slate-600 font-medium">
                          {employee.trn}
                        </td>
                        <td className="px-8 py-3 text-sm text-slate-600 font-medium">
                          {employee.nis}
                        </td>
                        <td className="px-8 py-3 text-sm text-slate-600 font-medium">
                          $
                          {salaryNum.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-8 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              employee.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-slate-50 text-slate-600 border-slate-100'
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-8 py-3 text-right">
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="h-[70px] border-t border-slate-100 px-8 flex items-center justify-between">
              <div className="text-sm text-slate-500 font-medium">
                Showing {filteredEmployees.length} of {employees.length} employees
              </div>
              <div className="flex gap-3">
                <button className="h-[40px] px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  Previous
                </button>
                <button className="h-[40px] px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AddEmployeeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEmployee}
      />
      <BulkUploadModal
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
}
