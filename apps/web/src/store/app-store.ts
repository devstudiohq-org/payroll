import { create } from 'zustand';

type AppState = {
  lastHealthCheckAt: string | null;
  setLastHealthCheckAt: (timestamp: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  lastHealthCheckAt: null,
  setLastHealthCheckAt: (timestamp) => {
    set({ lastHealthCheckAt: timestamp });
  },
}));
