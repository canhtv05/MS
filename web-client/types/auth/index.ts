export interface IUserProfileDTO {
  username: string;
  isGlobal: boolean;
  roles: string[];
  roleLabels: string[];
  permissions: string[];
  secretKey: string;
  channel: string;
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
