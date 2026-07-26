import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchEmployees,
  apiCreateEmployee,
  apiCreateEmployeesBulk,
  apiDeleteEmployee,
  type CreateEmployeePayload,
} from '../api/client';

const EMPLOYEES_KEY = ['employees'] as const;

export function useEmployees() {
  return useQuery({
    queryKey: EMPLOYEES_KEY,
    queryFn: fetchEmployees,
    staleTime: 30_000,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeePayload) => apiCreateEmployee(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
}

export function useCreateEmployeesBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employees: CreateEmployeePayload[]) => apiCreateEmployeesBulk(employees),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDeleteEmployee(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
}
