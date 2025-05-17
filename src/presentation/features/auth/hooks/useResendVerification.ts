import { useEffect, useState } from 'react';

import { NetworkError, ValidationError } from '@/application/features/auth/errors';

import { useAuthContext } from '../context/AuthContext';

interface UseResendVerificationResult {
  isLoading: boolean;
  error: string | null;
  resend: (email: string) => Promise<void>;
  isResendDisabled: boolean;
  remainingTime: number;
}

export const useResendVerification = (email?: string): UseResendVerificationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const { emailVerificationService } = useAuthContext();

  // Track verification status
  useEffect(() => {
    if (email) {
      const status = emailVerificationService.getVerificationStatus(email);
      if (!status.canResend && status.cooldownEndsAt) {
        const remaining = Math.ceil((status.cooldownEndsAt.getTime() - Date.now()) / 1000);
        setRemainingTime(Math.max(0, remaining));
      }
    }
  }, [email, emailVerificationService]);

  // Update remaining time
  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((time) => Math.max(0, time - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const resend = async (emailToVerify: string) => {
    if (remainingTime > 0) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await emailVerificationService.resendVerification(emailToVerify);

      if (!result.success) {
        setError(result.message);
      }

      if (result.cooldownSeconds > 0) {
        setRemainingTime(result.cooldownSeconds);
      }
    } catch (err) {
      if (err instanceof ValidationError || err instanceof NetworkError) {
        setError(err.message);
      } else {
        setError('Failed to resend verification email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    resend,
    isResendDisabled: remainingTime > 0 || isLoading,
    remainingTime,
  };
};
