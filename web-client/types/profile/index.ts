import { PrivacyLevel } from '@/enums';

export interface IUserProfileDTO {
  id: string;
  username: string;
  fullname: string;
  email: string;
  dob?: string;
  city?: string;
  gender?: string;
  bio?: string;
  coverUrl?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  socialLinks?: string[];
  profileVisibility: PrivacyLevel;
  friendsVisibility: PrivacyLevel;
  postsVisibility: PrivacyLevel;
  lastOnlineAt?: Date;
  followersCount: number;
  followingCount: number;
}
