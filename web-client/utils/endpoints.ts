export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/me/p/authenticate`,
    LOGOUT: `${BASE_URL}/auth/me/p/logout`,
    ME: `${BASE_URL}/auth/me`,
  },
  PROFILE: {
    ME: `${BASE_URL}/user-profile/me`,
  },
};
