import { beforeEach, describe, expect, it } from 'vitest';

import { useAuthStore } from './auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts unauthenticated with no user', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('signs the user in with the provided email', () => {
    useAuthStore.getState().login('admin@zylker.com');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toMatchObject({
      name: 'Bonita Smith',
      email: 'admin@zylker.com',
    });
    expect(state.user?.avatarUrl).toBeTruthy();
  });

  it('clears the session on logout', () => {
    useAuthStore.getState().login('admin@zylker.com');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
