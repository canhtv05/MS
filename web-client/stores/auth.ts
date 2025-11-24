import { create } from 'zustand';
import { IUserProfileDTO } from '../types/auth';

interface AuthState {
  token: string | null;
  user: IUserProfileDTO | undefined;
  setToken: (token: string | null) => void;
  setUser: (user: IUserProfileDTO | undefined) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: undefined,
  setToken: token => set({ token }),
  setUser: user => set({ user }),
  logout: () => set({ token: null, user: undefined }),
}));
