import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CompanyDto, CreateCompanyInput } from '@starter/types';

import { createCompany, fetchCompanies } from '../api/client';

export const companiesQueryKey = ['companies'] as const;

export function useCompanies() {
  return useQuery({
    queryKey: companiesQueryKey,
    queryFn: fetchCompanies,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCompanyInput) => createCompany(input),
    onSuccess: (company: CompanyDto) => {
      // Refresh the company list so new data shows without a manual reload.
      queryClient.setQueryData<CompanyDto[]>(companiesQueryKey, (prev) =>
        prev ? [...prev, company] : [company],
      );
      void queryClient.invalidateQueries({ queryKey: companiesQueryKey });
    },
  });
}
