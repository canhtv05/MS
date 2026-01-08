import { Gender, PrivacyLevel, RelationshipStatus } from '@/enums/common';

export type { IProfileDTO as IUserProfileDTO } from './auth';

export interface IMediaHistoryDTO {
  id: string;
  userId: string;
  url: string;
  type: string;
  createdAt: string;
}

export interface IMediaHistoryGroupDTO {
  date: string;
  items: IMediaHistoryDTO[];
}

export interface ChangeCoverByUrlReq {
  url: string;
}

export interface IInterestDTO {
  id: string;
  title: string;
  color: string;
}

export interface IUserProfileIntroduceDTO {
  id: string;
  city: string;
  hometown: string;
  jobTitle: string;
  company: string;
  school: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  dob: string;
  gender: Gender;
  relationshipStatus: RelationshipStatus;
  phoneNumber: string;
  interests: IInterestDTO[];
}

export interface IUserProfilePrivacyDTO {
  id: string;
  profileVisibility: PrivacyLevel;
  friendsVisibility: PrivacyLevel;
  postsVisibility: PrivacyLevel;
}

export interface IDetailUserProfileDTO {
  id: string;
  userId: string;
  fullname: string;
  bio: string;
  coverUrl: string;
  avatarUrl: string;
  introduce: IUserProfileIntroduceDTO;
  privacy: IUserProfilePrivacyDTO;
  lastOnlineAt: string;
  followersCount: number;
  followingCount: number;
  createdDate: string;
}
