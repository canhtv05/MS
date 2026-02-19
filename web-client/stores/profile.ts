import { create } from 'zustand';
import { IDetailUserProfileDTO, IImageHistoryDTO } from '../types/profile';

interface MyProfileState {
  myProfile: IDetailUserProfileDTO | undefined;
  setMyProfile: (userProfile: IDetailUserProfileDTO | undefined) => void;
  myMediaHistory: IImageHistoryDTO[] | undefined;
  setMyMediaHistory: (mediaHistory: IImageHistoryDTO[] | undefined) => void;
}

interface UserProfileState {
  user: IDetailUserProfileDTO | undefined;
  setUser: (user: IDetailUserProfileDTO | undefined) => void;
}

export const useMyProfileStore = create<MyProfileState>(set => ({
  myProfile: undefined,
  setMyProfile: userProfile => set({ myProfile: userProfile }),
  myMediaHistory: undefined,
  setMyMediaHistory: mediaHistory => set({ myMediaHistory: mediaHistory }),
}));

export const useUserProfileStore = create<UserProfileState>(set => ({
  user: undefined,
  setUser: user => set({ user: user }),
}));
