import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import type { Employee } from '../../types/employees';

type BulkUploadModalProps = {
  open: boolean;
  onClose: () => void;
  onUpload: (employees: Omit<Employee, 'id' | 'initials'>[]) => void | Promise<unknown>;
};

type ParsedRow = {
  name: string;
  role: string;
  trn: string;
  nis: string;
  salary: number;
  status: 'Active' | 'Inactive';
  error?: string;
};

type UploadStage = 'upload' | 'preview' | 'success';

const TEMPLATE_CSV = `name,role,trn,nis,salary,status
Marcus Thompson,Operations Manager,123-456-789,CD12345,185000,Active
Keisha Brown,Senior Accountant,987-654-321,AB67890,145000,Active
Devon Williams,Production Supervisor,456-789-123,EF34567,125000,Active`;

function parseCSV(text: string): { rows: ParsedRow[]; errorCount: number } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { rows: [], errorCount: 0 };
  }

  const header = lines[0]!.toLowerCase().split(',').map((h) => h.trim());
  const nameIdx = header.indexOf('name');
  const roleIdx = header.indexOf('role');
  const trnIdx = header.indexOf('trn');
  const nisIdx = header.indexOf('nis');
  const salaryIdx = header.indexOf('salary');
  const statusIdx = header.indexOf('status');

  let errorCount = 0;

  const rows: ParsedRow[] = lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    const name = nameIdx >= 0 ? cols[nameIdx] || '' : '';
    const role = roleIdx >= 0 ? cols[roleIdx] || '' : '';
    const trn = trnIdx >= 0 ? cols[trnIdx] || '' : '';
    const nis = nisIdx >= 0 ? cols[nisIdx] || '' : '';
    const salaryStr = salaryIdx >= 0 ? cols[salaryIdx] || '0' : '0';
    const statusStr = statusIdx >= 0 ? cols[statusIdx] || 'Active' : 'Active';

    const salary = parseFloat(salaryStr);
    const status: 'Active' | 'Inactive' =
      statusStr.toLowerCase() === 'inactive' ? 'Inactive' : 'Active';

    const errors: string[] = [];
    if (!name) errors.push('Missing name');
    if (!role) errors.push('Missing role');
    if (!trn) errors.push('Missing TRN');
    if (!nis) errors.push('Missing NIS');
    if (isNaN(salary) || salary <= 0) errors.push('Invalid salary');

    const error = errors.length > 0 ? errors.join(', ') : undefined;
    if (error) errorCount++;

    return { name, role, trn, nis, salary: isNaN(salary) ? 0 : salary, status, error };
  });

  return { rows, errorCount };
}

export function BulkUploadModal({ open, onClose, onUpload }: BulkUploadModalProps) {
  const [stage, setStage] = useState<UploadStage>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [fileName, setFileName] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStage('upload');
      setParsedRows([]);
      setErrorCount(0);
      setFileName('');
      setIsDragging(false);
      setUploadedCount(0);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { rows, errorCount: errCount } = parseCSV(text);
      setParsedRows(rows);
      setErrorCount(errCount);
      setStage('preview');
    };
    reader.readAsText(file);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      processFile(file);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDownloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeRow(index: number) {
    const updated = parsedRows.filter((_, i) => i !== index);
    const newErrors = updated.filter((r) => r.error).length;
    setParsedRows(updated);
    setErrorCount(newErrors);
  }

  async function handleConfirmUpload() {
    const validRows = parsedRows
      .filter((r) => !r.error)
      .map(({ name, role, trn, nis, salary, status }) => ({
        name,
        email: '',
        startDate: new Date().toISOString().split('T')[0]!,
        role,
        department: '',
        trn,
        nis,
        salary,
        taxCode: 'TC01',
        status,
        allowances: [],
        deductions: [],
      }));

    if (validRows.length === 0) return;

    try {
      await Promise.resolve(onUpload(validRows));
      setUploadedCount(validRows.length);
      setStage('success');
    } catch {
      // stay on preview stage on error
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  if (!open) return null;

  const validCount = parsedRows.length - errorCount;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform transition-all duration-300"
        style={{ animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Bulk Upload Employees</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {stage === 'upload' && 'Upload a CSV file with employee data'}
              {stage === 'preview' && `Previewing ${parsedRows.length} rows from ${fileName}`}
              {stage === 'success' && 'Upload complete!'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {stage === 'upload' && (
            <div className="space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-brand bg-blue-50/80 scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-colors ${
                    isDragging ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Upload size={28} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {isDragging ? 'Drop your file here' : 'Drag & drop your CSV file here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">or click to browse files</p>
                <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                  <FileSpreadsheet size={14} />
                  Supports .csv files
                </p>
              </div>

              {/* Template download */}
              <div className="flex items-center gap-3 p-4 bg-blue-50/80 border border-blue-100 rounded-xl">
                <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <Download size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Need a template?</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Download our CSV template with example data
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadTemplate();
                  }}
                  className="h-9 px-4 rounded-lg border border-brand/20 bg-white text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-all cursor-pointer shrink-0"
                >
                  Download
                </button>
              </div>

              {/* Expected format */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Expected CSV Format
                </p>
                <code className="text-xs text-slate-500 block font-mono leading-relaxed">
                  name, role, trn, nis, salary, status
                </code>
              </div>
            </div>
          )}

          {stage === 'preview' && (
            <div className="space-y-4">
              {/* Summary badges */}
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    {validCount} valid
                  </span>
                </div>
                {errorCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">
                      {errorCount} with errors
                    </span>
                  </div>
                )}
              </div>

              {/* Table preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          TRN
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Salary
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedRows.map((row, i) => (
                        <tr
                          key={i}
                          className={`transition-colors ${
                            row.error ? 'bg-red-50/50' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {row.name || (
                              <span className="text-red-400 italic">Missing</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {row.role || (
                              <span className="text-red-400 italic">Missing</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                            {row.trn || (
                              <span className="text-red-400 italic">Missing</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {row.salary > 0 ? (
                              `$${row.salary.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                              })}`
                            ) : (
                              <span className="text-red-400 italic">Invalid</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                row.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeRow(i)}
                              className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove row"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {errorCount > 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Rows with errors will be skipped during import. You can remove them or go back to fix your CSV.
                  </p>
                </div>
              )}
            </div>
          )}

          {stage === 'success' && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                style={{ animation: 'successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload Successful!</h3>
              <p className="text-sm text-slate-500 mt-1">
                {uploadedCount} employee{uploadedCount !== 1 ? 's have' : ' has'} been added to
                the system.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          {stage === 'upload' && (
            <button
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {stage === 'preview' && (
            <>
              <button
                onClick={() => setStage('upload')}
                className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => { void handleConfirmUpload(); }}
                disabled={validCount === 0}
                className="h-11 px-6 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload size={16} />
                Import {validCount} Employee{validCount !== 1 ? 's' : ''}
              </button>
            </>
          )}

          {stage === 'success' && (
            <button
              onClick={onClose}
              className="h-11 px-6 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
