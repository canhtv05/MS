export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://unspilt-enthusedly-shantell.ngrok-free.dev/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/me/p/authenticate`,
    LOGOUT: `${BASE_URL}/auth/me/p/logout`,
    ME: `${BASE_URL}/auth/me`,
    REGISTER: `${BASE_URL}/auth/me/c/create`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/me/p/change-password`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/me/p/forgot-password`,
    VERIFY_FORGOT_PASSWORD_OTP: `${BASE_URL}/auth/me/p/verify-forgot-password-otp`,
    RESET_PASSWORD: `${BASE_URL}/auth/me/p/reset-password`,
  },
  PROFILE: {
    ME: `${BASE_URL}/user-profile/me`,
    GET_USER_PROFILE: `${BASE_URL}/user-profile/profile/{username}`,
  },
  NOTIFICATIONS: {
    VERIFY_EMAIL: `${BASE_URL}/notifications/verify-email`,
    RESEND_VERIFY_EMAIL: `${BASE_URL}/notifications/resend-verify-email`,
  },
};
