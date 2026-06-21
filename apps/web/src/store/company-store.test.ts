import { beforeEach, describe, expect, it } from 'vitest';

import { useCompanyStore } from './company-store';

describe('useCompanyStore', () => {
  beforeEach(() => {
    useCompanyStore.getState().clearActiveCompany();
  });

  it('starts with no active company', () => {
    expect(useCompanyStore.getState().activeCompanyId).toBeNull();
  });

  it('sets the active company id', () => {
    useCompanyStore.getState().setActiveCompany('company-123');
    expect(useCompanyStore.getState().activeCompanyId).toBe('company-123');
  });

  it('clears the active company', () => {
    useCompanyStore.getState().setActiveCompany('company-123');
    useCompanyStore.getState().clearActiveCompany();
    expect(useCompanyStore.getState().activeCompanyId).toBeNull();
  });
});
