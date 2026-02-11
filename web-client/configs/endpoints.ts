export const API_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:1000/api/v1';

export const API_FRONTEND_URL = process.env.NEXT_PUBLIC_API_FRONTEND_URL || '/api/proxy';

// Relative path so it uses api's baseURL (/api/proxy) -> /api/proxy/graphql
export const GRAPHQL_ENDPOINT = '/graphql';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/me/p/authenticate',
    LOGOUT: '/auth/me/p/logout',
    REGISTER: '/auth/me/c/create',
    CHANGE_PASSWORD: '/auth/me/p/change-password',
    FORGOT_PASSWORD: '/auth/me/p/forgot-password',
    VERIFY_FORGOT_PASSWORD_OTP: '/auth/me/p/verify-forgot-password-otp',
    RESET_PASSWORD: '/auth/me/p/reset-password',
    LOGOUT_ALL_DEVICES: '/auth/me/p/logout-all-devices',
  },
  PROFILE: {
    ME: '/user-profile/me',
    GET_USER_PROFILE: '/user-profile/profile/{username}',
    CHANGE_COVER_IMAGE: '/user-profile/me/change-cover-image',
    CHANGE_AVATAR_IMAGE: '/user-profile/me/change-avatar-image',
    CHANGE_COVER_IMAGE_FROM_MEDIA_HISTORY: '/user-profile/me/change-cover-image-from-media-history',
    UPDATE_BIO: '/user-profile/me/update-bio',
    UPDATE_PRIVACY: '/user-profile/me/update-privacy',
    INTERESTS: '/user-profile/interests',
    UPDATE_USER_PROFILE_INTEREST: '/user-profile/me/update-user-profile-interest',
    UPDATE_USER_PROFILE_INTRODUCE: '/user-profile/me/update-user-profile-introduce',
  },
  NOTIFICATIONS: {
    VERIFY_EMAIL: '/notifications/verify-email',
    RESEND_VERIFY_EMAIL: '/notifications/resend-verify-email',
  },
  FILES: {
    SEARCH_MEDIA_HISTORY: '/files/search-media-history',
  },
};
