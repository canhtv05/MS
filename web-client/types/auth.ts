import { Gender, PrivacyLevel } from '@/enums/common';

// Auth response
export interface IAuthMeDTO {
  username: string;
  fullName: string;
  email: string;
  isGlobal: boolean;
  roles: string[];
  roleLabels: string[];
  permissions: string[];
  secretKey: string;
  channel: string;
}

// Profile response
export interface IProfileDTO {
  userId: string;
  fullname: string;
  dob: string;
  city: string;
  bio: string;
  coverUrl: string;
  avatarUrl: string;
  gender: Gender;
  phoneNumber: string;
  createdDate: string;
  lastOnlineAt: string;
  tiktokUrl: string;
  fbUrl: string;
  profileVisibility: PrivacyLevel;
  friendsVisibility: PrivacyLevel;
  postsVisibility: PrivacyLevel;
  followersCount: number;
  followingCount: number;
}

export interface IUserProfileDTO {
  auth: IAuthMeDTO;
  profile: IProfileDTO;
}

export interface ILoginResponse {
  token: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
  channel?: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  fullname: string;
  password: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IVerifyOTPReq {
  email: string;
  OTP: string;
}

export interface IResetPasswordReq {
  email: string;
  OTP: string;
  newPassword: string;
}
