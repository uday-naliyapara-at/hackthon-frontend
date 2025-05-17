import type { User } from '../user/types';
import { UserEntity } from '../user/User';

/**
 * Email verification related types
 */
export interface EmailVerificationResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

export interface ResendVerificationResult {
  success: boolean;
  message: string;
  cooldownSeconds: number;
}

export interface VerificationStatus {
  isVerified: boolean;
  canResend: boolean;
  cooldownEndsAt?: Date;
}

/**
 * Session related types
 */
export interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserEntity | null;
}

export interface AuthGuardConfig {
  redirectTo?: string;
}
