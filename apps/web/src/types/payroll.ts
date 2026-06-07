export interface PayrollRun {
  id: string;
  period: string;
  employees: number;
  totalNetPay: number;
  status: 'Completed' | 'Pending' | 'Processing';
  completed: string;
}
