import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanyState {
  /** Id of the company the user is currently managing payroll for. */
  activeCompanyId: string | null;
  setActiveCompany: (companyId: string) => void;
  clearActiveCompany: () => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      activeCompanyId: null,
      setActiveCompany: (companyId) => set({ activeCompanyId: companyId }),
      clearActiveCompany: () => set({ activeCompanyId: null }),
    }),
    { name: 'payroll-active-company' },
  ),
);
