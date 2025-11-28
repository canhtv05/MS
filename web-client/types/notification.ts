import { VerificationStatus } from '@/enums';

export interface IVerifyEmailTokenResponse {
  valid: boolean;
  verificationStatus: VerificationStatus;
}

export interface IVerificationEmailEvent {
  to: string;
  username: string;
}
