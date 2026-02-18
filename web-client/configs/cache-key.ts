export const CACHE_KEY = {
  AUTH: {
    QUERY: {
      ME: ['auth', 'me'] as const,
    },
    MUTATION: {
      LOGIN: 'auth:login',
      LOGOUT: 'auth:logout',
      LOGOUT_ALL_DEVICES: 'auth:logout-all-devices',
      REGISTER: 'auth:register',
      CHANGE_PASSWORD: 'auth:change-password',
      FORGOT_PASSWORD: 'auth:forgot-password',
      VERIFY_FORGOT_PASSWORD_OTP: 'auth:verify-forgot-password-otp',
      RESET_PASSWORD: 'auth:reset-password',
    },
  },
  PROFILE: {
    QUERY: {
      ME: ['profile', 'me'] as const,
      MEDIA_HISTORY_INFINITE: (userId?: string, resourceType?: unknown) =>
        ['profile', 'media-history-infinite', userId, resourceType] as const,
      INTERESTS: (searchRequest?: Record<string, unknown>) =>
        ['profile', 'interests', searchRequest] as const,
      USER_PROFILE: (username?: string) => ['profile', 'user-profile', username] as const,
      PRIVACY: (username?: string) => ['profile', 'privacy', username] as const,
    },
    MUTATION: {
      CHANGE_COVER_IMAGE: 'profile:change-cover-image',
      CHANGE_AVATAR_IMAGE: 'profile:change-avatar-image',
      CHANGE_COVER_IMAGE_FROM_MEDIA_HISTORY: 'profile:change-cover-image-from-media-history',
      UPDATE_BIO_AND_FULLNAME_PROFILE: 'profile:update-bio-and-fullname-profile',
      UPDATE_PRIVACY: 'profile:update-privacy',
      INTERESTS: 'profile:interests',
      UPDATE_USER_PROFILE_INTEREST: 'profile:update-user-profile-interest',
      UPDATE_USER_PROFILE_INTRODUCE: 'profile:update-user-profile-introduce',
    },
  },
  NOTIFICATION: {
    MUTATION: {
      RESEND_VERIFY_EMAIL: 'notification:resend-verify-email',
    },
  },
} as const;
