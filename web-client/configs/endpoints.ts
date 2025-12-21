export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:1000/api/v1';

export const API_FRONTEND_URL = process.env.NEXT_PUBLIC_API_FRONTEND_URL || '/api/proxy';

export const GRAPHQL_ENDPOINT = `${API_FRONTEND_URL}/graphql`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/me/p/authenticate',
    LOGOUT: '/auth/me/p/logout',
    ME: '/auth/me',
    REGISTER: '/auth/me/c/create',
    CHANGE_PASSWORD: '/auth/me/p/change-password',
    FORGOT_PASSWORD: '/auth/me/p/forgot-password',
    VERIFY_FORGOT_PASSWORD_OTP: '/auth/me/p/verify-forgot-password-otp',
    RESET_PASSWORD: '/auth/me/p/reset-password',
  },
  PROFILE: {
    ME: '/user-profile/me',
    GET_USER_PROFILE: '/user-profile/profile/{username}',
  },
  NOTIFICATIONS: {
    VERIFY_EMAIL: '/notifications/verify-email',
    RESEND_VERIFY_EMAIL: '/notifications/resend-verify-email',
  },
};
