import { create } from 'zustand';
import { IUserProfileDTO } from '../types/profile';

interface ProfileState {
  userProfile: IUserProfileDTO | undefined;
  setUserProfile: (userProfile: IUserProfileDTO | undefined) => void;
}

export const useProfileStore = create<ProfileState>(set => ({
  userProfile: undefined,
  setUserProfile: userProfile => set({ userProfile: userProfile }),
}));
