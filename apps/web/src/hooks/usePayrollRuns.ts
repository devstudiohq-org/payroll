import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreatePayrollRunInput } from '@starter/types';

import { createPayrollRun, fetchPayrollRuns } from '../api/client';

export const payrollRunsQueryKey = (companyId: string | null) =>
  ['payroll-runs', companyId] as const;

export function usePayrollRuns(companyId: string | null) {
  return useQuery({
    queryKey: payrollRunsQueryKey(companyId),
    queryFn: () => fetchPayrollRuns(companyId as string),
    enabled: Boolean(companyId),
  });
}

export function useCreatePayrollRun(companyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePayrollRunInput) =>
      createPayrollRun(companyId as string, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: payrollRunsQueryKey(companyId) });
    },
  });
}
