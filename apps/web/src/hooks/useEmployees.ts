import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateEmployeeInput, UpdateEmployeeInput } from '@starter/types';

import { createEmployee, fetchEmployees, updateEmployee } from '../api/client';

export const employeesQueryKey = (companyId: string | null) =>
  ['employees', companyId] as const;

export function useEmployees(companyId: string | null) {
  return useQuery({
    queryKey: employeesQueryKey(companyId),
    queryFn: () => fetchEmployees(companyId as string),
    enabled: Boolean(companyId),
  });
}

export function useCreateEmployee(companyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) =>
      createEmployee(companyId as string, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKey(companyId) });
    },
  });
}

export function useUpdateEmployee(companyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, input }: { employeeId: string; input: UpdateEmployeeInput }) =>
      updateEmployee(companyId as string, employeeId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKey(companyId) });
    },
  });
}
