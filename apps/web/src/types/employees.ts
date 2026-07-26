export interface EmployeeAllowance {
  name: string;
  amount: number;
}

export interface EmployeeDeduction {
  name: string;
  amount: number;
}

export interface Employee {
  id: number;
  initials: string;
  name: string;
  email: string;
  startDate: string;
  role: string;
  department: string;
  trn: string;
  nis: string;
  salary: number;
  taxCode: string;
  status: 'Active' | 'Inactive';
  allowances: EmployeeAllowance[];
  deductions: EmployeeDeduction[];
}
