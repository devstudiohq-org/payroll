import { create } from 'zustand';
import type { Employee } from '../types/employees';

let nextId = 1;

function generateInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join('');
}

type EmployeeInput = Omit<Employee, 'id' | 'initials'>;

type EmployeeState = {
  employees: Employee[];
  addEmployee: (data: EmployeeInput) => void;
  addEmployees: (batch: EmployeeInput[]) => void;
  removeEmployee: (id: number) => void;
  updateEmployee: (id: number, data: Partial<EmployeeInput>) => void;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],

  addEmployee: (data) =>
    set((state) => ({
      employees: [
        ...state.employees,
        { ...data, id: nextId++, initials: generateInitials(data.name) },
      ],
    })),

  addEmployees: (batch) =>
    set((state) => ({
      employees: [
        ...state.employees,
        ...batch.map((data) => ({
          ...data,
          id: nextId++,
          initials: generateInitials(data.name),
        })),
      ],
    })),

  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    })),

  updateEmployee: (id, data) =>
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id
          ? {
              ...e,
              ...data,
              initials: data.name ? generateInitials(data.name) : e.initials,
            }
          : e,
      ),
    })),
}));
