import { PrivacyLevel } from '@/enums/common';

export interface IUserProfileDTO {
  id: string;
  userId: string;
  dob?: string;
  city?: string;
  gender?: string;
  bio?: string;
  coverUrl?: string;
  phoneNumber?: string;
  fullname: string;
  avatarUrl?: string;
  tiktokUrl?: string;
  fbUrl?: string;
  createdDate: string;
  profileVisibility: PrivacyLevel;
  friendsVisibility: PrivacyLevel;
  postsVisibility: PrivacyLevel;
  lastOnlineAt?: Date;
  followersCount: number;
  followingCount: number;
}
