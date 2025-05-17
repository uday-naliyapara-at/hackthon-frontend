import { IAuthRepository } from '../../../domain/interfaces/auth';
import { IEmailVerificationService } from '../../../domain/interfaces/auth/IEmailVerificationService';
import {
  EmailVerificationResult,
  ResendVerificationResult,
  VerificationStatus,
} from '../../../domain/models/auth';
import { NetworkError, ValidationError } from './errors';

/**
 * Service for handling email verification operations
 * Manages verification flow and cooldown state
 */
export class EmailVerificationService implements IEmailVerificationService {
  private cooldownMap: Map<string, Date> = new Map();
  private readonly COOLDOWN_SECONDS = 60;

  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Verify email with the provided token
   * @throws {ValidationError} When token is invalid or expired
   * @throws {NetworkError} When network error occurs
   */
  async verifyEmail(token: string): Promise<EmailVerificationResult> {
    try {
      await this.authRepository.verifyEmail(token);
      return {
        success: true,
        message: 'Email verified successfully',
        redirectUrl: '/auth/login',
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          message: error.message,
        };
      }
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Failed to verify email');
    }
  }

  /**
   * Resend verification email with cooldown check
   * @throws {ValidationError} When email is invalid
   * @throws {NetworkError} When network error occurs
   */
  async resendVerification(email: string): Promise<ResendVerificationResult> {
    if (!this.canResendVerification(email)) {
      const cooldownEndsAt = this.cooldownMap.get(email)!;
      const remainingSeconds = Math.ceil((cooldownEndsAt.getTime() - Date.now()) / 1000);
      return {
        success: false,
        message: `Please wait ${remainingSeconds} seconds before requesting another verification email`,
        cooldownSeconds: remainingSeconds,
      };
    }

    try {
      await this.authRepository.resendVerificationEmail(email);
      this.setCooldown(email);
      return {
        success: true,
        message: 'Verification email sent successfully',
        cooldownSeconds: this.COOLDOWN_SECONDS,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          success: false,
          message: error.message,
          cooldownSeconds: 0,
        };
      }
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Failed to resend verification email');
    }
  }

  /**
   * Get current verification status including cooldown
   */
  getVerificationStatus(email: string): VerificationStatus {
    const cooldownEndsAt = this.cooldownMap.get(email);
    const canResend = !cooldownEndsAt || cooldownEndsAt.getTime() <= Date.now();

    return {
      isVerified: false, // This should come from user state in a real implementation
      canResend,
      cooldownEndsAt: canResend ? undefined : cooldownEndsAt,
    };
  }

  /**
   * Check if resend is allowed (not in cooldown)
   */
  canResendVerification(email: string): boolean {
    const cooldownEndsAt = this.cooldownMap.get(email);
    return !cooldownEndsAt || cooldownEndsAt.getTime() <= Date.now();
  }

  /**
   * Set cooldown for the email
   */
  private setCooldown(email: string): void {
    const cooldownEndsAt = new Date(Date.now() + this.COOLDOWN_SECONDS * 1000);
    this.cooldownMap.set(email, cooldownEndsAt);
  }
}
