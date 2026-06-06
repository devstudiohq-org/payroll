export interface ComplianceReport {
  id: string;
  reportType: 'SO1 File' | 'P24 File';
  period: string;
  status: 'Filed' | 'Generated';
  generated: string;
  filed: string; // e.g. '4/9/2026' or '-'
}
