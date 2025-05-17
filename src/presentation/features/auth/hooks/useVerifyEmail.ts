import { useCallback, useState } from 'react';

import { NetworkError, ValidationError } from '@/application/features/auth/errors';

import { useAuthContext } from '../context/AuthContext';

interface UseVerifyEmailResult {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  verify: (token: string) => Promise<void>;
}

export const useVerifyEmail = (): UseVerifyEmailResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { emailVerificationService } = useAuthContext();

  const verify = useCallback(
    async (verificationToken: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await emailVerificationService.verifyEmail(verificationToken);
        setIsSuccess(result.success);
        if (!result.success && result.message) {
          setError(result.message);
        }
      } catch (err) {
        setIsSuccess(false);
        if (err instanceof ValidationError || err instanceof NetworkError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [emailVerificationService]
  );

  return {
    isLoading,
    isSuccess,
    error,
    verify,
  };
};
