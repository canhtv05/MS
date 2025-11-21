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
