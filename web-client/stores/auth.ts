import { create } from 'zustand';
import { IUserProfileDTO } from '../types/auth';

interface AuthState {
  user: IUserProfileDTO | undefined;
  setUser: (user: IUserProfileDTO | undefined) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: undefined,
  setUser: user => set({ user }),
  logout: () => set({ user: undefined }),
}));
