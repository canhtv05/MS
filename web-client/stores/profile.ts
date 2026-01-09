import { create } from 'zustand';
import { IProfileDTO } from '../types/auth';
import { IImageHistoryDTO } from '../types/profile';

interface ProfileState {
  userProfile: IProfileDTO | undefined;
  setUserProfile: (userProfile: IProfileDTO | undefined) => void;
  mediaHistory: IImageHistoryDTO[] | undefined;
  setMediaHistory: (mediaHistory: IImageHistoryDTO[] | undefined) => void;
}

export const useProfileStore = create<ProfileState>(set => ({
  userProfile: undefined,
  setUserProfile: userProfile => set({ userProfile: userProfile }),
  mediaHistory: undefined,
  setMediaHistory: mediaHistory => set({ mediaHistory: mediaHistory }),
}));
