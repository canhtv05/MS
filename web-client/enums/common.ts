export enum Viewport {
  '2XL' = 1536,
  XL = 1280,
  LG = 1024,
  MD = 768,
  SM = 640,
}

export enum Status {
  UNAUTHENTICATED = 'status.unauthenticated',
  UPDATE_SUCCESS = 'status.update_success',
  UPDATE_FAILED = 'status.update_failed',
  ADD_SUCCESS = 'status.add_success',
  ADD_FAILED = 'status.add_failed',
  REMOVE_SUCCESS = 'status.remove_success',
  REMOVE_FAILED = 'status.remove_failed',
  ERROR = 'status.error',
}

export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CUSTOM = 'CUSTOM',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  INVALID = 'INVALID',
  EXPIRED = 'EXPIRED',
}
