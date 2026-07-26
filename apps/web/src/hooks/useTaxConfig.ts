import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TaxConfigDto, UpsertTaxConfigInput } from '@starter/types';

import { fetchTaxConfig, saveTaxConfig } from '../api/client';

export const taxConfigQueryKey = (companyId: string | null) =>
  ['tax-config', companyId] as const;

export function useTaxConfig(companyId: string | null) {
  return useQuery({
    queryKey: taxConfigQueryKey(companyId),
    queryFn: () => fetchTaxConfig(companyId as string),
    enabled: Boolean(companyId),
  });
}

export function useSaveTaxConfig(companyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertTaxConfigInput) => saveTaxConfig(companyId as string, input),
    onSuccess: (config: TaxConfigDto) => {
      queryClient.setQueryData(taxConfigQueryKey(companyId), config);
    },
  });
}
