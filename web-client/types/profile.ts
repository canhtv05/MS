import { Gender, PrivacyLevel, RelationshipStatus, ResourceType } from '@/enums/common';
import { IMediaHistoryGroupDTO } from './file';

export type { IProfileDTO as IUserProfileDTO } from './auth';

export interface IImageHistoryDTO {
  imageUrl: string;
  contentType: string;
  fileSize: number;
  originFileName: string;
  publicId: string;
  createdAt: string;
  resourceType: ResourceType;
}

export interface IImageHistoryGroupDTO {
  date: string;
  items: IImageHistoryDTO[];
}

export interface IUpdateBioProfileReq {
  bio: string;
}

export interface IChangeCoverByUrlReq {
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
  images: IMediaHistoryGroupDTO;
  lastOnlineAt: string;
  followersCount: number;
  followingCount: number;
  createdDate: string;
}
