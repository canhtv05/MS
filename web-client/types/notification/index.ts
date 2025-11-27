import { VerificationStatus } from '@/enums';

export interface IVerifyEmailTokenResponse {
  valid: boolean;
  verificationStatus: VerificationStatus;
}
