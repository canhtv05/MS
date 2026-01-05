// Auth response
export interface IAuthMeDTO {
  username: string;
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
  id: string;
  userId: string;
  fullname: string;
  coverUrl: string;
  bio: string;
  avatarUrl: string;
  createdDate: string;
  lastOnlineAt: string;
  followersCount: number;
  followingCount: number;
}

export interface IUserProfileDTO {
  auth: IAuthMeDTO;
  profile: IProfileDTO;
}

export interface IAuthenticateResponse {
  authenticate: boolean;
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
