export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/me/p/authenticate`,
    LOGOUT: `${BASE_URL}/auth/me/p/logout`,
    ME: `${BASE_URL}/auth/me`,
    REGISTER: `${BASE_URL}/auth/me/c/create`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/me/p/change-password`,
  },
  PROFILE: {
    ME: `${BASE_URL}/user-profile/me`,
  },
  NOTIFICATIONS: {
    VERIFY_EMAIL: `${BASE_URL}/notifications/verify-email`,
  },
};
