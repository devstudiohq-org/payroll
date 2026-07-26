import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdatePayslipInput } from '@starter/types';

import { fetchPayslips, updatePayslip } from '../api/client';

export const payslipsQueryKey = (companyId: string | null, runId: string | null) =>
  ['payslips', companyId, runId] as const;

export function usePayslips(companyId: string | null, runId: string | null) {
  return useQuery({
    queryKey: payslipsQueryKey(companyId, runId),
    queryFn: () => fetchPayslips(companyId as string, runId as string),
    enabled: Boolean(companyId && runId),
  });
}

export function useUpdatePayslip(companyId: string | null, runId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { payslipId: string; input: UpdatePayslipInput }) =>
      updatePayslip(companyId as string, runId as string, args.payslipId, args.input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: payslipsQueryKey(companyId, runId) });
    },
  });
}
