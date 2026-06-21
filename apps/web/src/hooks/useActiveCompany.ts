import { useCompanies } from './useCompanies';
import { useCompanyStore } from '../store/company-store';

/** The full record for the company the user is currently managing, or null. */
export function useActiveCompany() {
  const activeCompanyId = useCompanyStore((state) => state.activeCompanyId);
  const { data: companies } = useCompanies();

  return companies?.find((company) => company.id === activeCompanyId) ?? null;
}
