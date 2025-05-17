import {
  EmailVerificationResult,
  ResendVerificationResult,
  VerificationStatus,
} from '../../models/auth/types';

export interface IEmailVerificationService {
  /**
   * Verify email with the provided token
   * @param token - The verification token from email
   */
  verifyEmail(token: string): Promise<EmailVerificationResult>;

  /**
   * Resend verification email with cooldown check
   * @param email - The email to resend verification to
   */
  resendVerification(email: string): Promise<ResendVerificationResult>;

  /**
   * Get current verification status including cooldown
   * @param email - The email to check status for
   */
  getVerificationStatus(email: string): VerificationStatus;

  /**
   * Check if resend is allowed (not in cooldown)
   * @param email - The email to check cooldown for
   */
  canResendVerification(email: string): boolean;
}
