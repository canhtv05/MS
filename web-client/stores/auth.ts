import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: string;
  setToken: (token: string | null) => void;
  setUser: (user: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: '',
  setToken: token => set({ token }),
  setUser: user => set({ user }),
  logout: () => set({ token: null, user: '' }),
}));
