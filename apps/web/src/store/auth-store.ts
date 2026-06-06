import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const DEMO_AVATAR = 'https://i.pravatar.cc/80?img=47';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // Dev-only login: accepts any credentials and signs the user in.
      // Replace with a real request to the auth endpoint when available.
      login: (email) =>
        set({
          user: { name: 'Bonita Smith', email, avatarUrl: DEMO_AVATAR },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'payroll-auth' },
  ),
);
