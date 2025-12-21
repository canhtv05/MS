import { create } from 'zustand';
import { IProfileDTO } from '../types/auth';

interface ProfileState {
  userProfile: IProfileDTO | undefined;
  setUserProfile: (userProfile: IProfileDTO | undefined) => void;
}

export const useProfileStore = create<ProfileState>(set => ({
  userProfile: undefined,
  setUserProfile: userProfile => set({ userProfile: userProfile }),
}));
