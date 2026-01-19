import { create } from 'zustand';
import { IDetailUserProfileDTO, IImageHistoryDTO } from '../types/profile';

interface ProfileState {
  userProfile: IDetailUserProfileDTO | undefined;
  setUserProfile: (userProfile: IDetailUserProfileDTO | undefined) => void;
  mediaHistory: IImageHistoryDTO[] | undefined;
  setMediaHistory: (mediaHistory: IImageHistoryDTO[] | undefined) => void;
}

export const useProfileStore = create<ProfileState>(set => ({
  userProfile: undefined,
  setUserProfile: userProfile => set({ userProfile: userProfile }),
  mediaHistory: undefined,
  setMediaHistory: mediaHistory => set({ mediaHistory: mediaHistory }),
}));
