export interface Employee {
  id: number;
  initials: string;
  name: string;
  role: string;
  trn: string;
  nis: string;
  salary: number;
  status: 'Active' | 'Inactive';
}
