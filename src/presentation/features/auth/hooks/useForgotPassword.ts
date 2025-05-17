import { useState } from 'react';

import { ForgotPasswordError, ValidationError } from '../../../../application/features/auth/errors';
import { useAuthContext } from '../context/AuthContext';

interface UseForgotPasswordReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  handleForgotPassword: (email: string) => Promise<void>;
  reset: () => void;
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { authService } = useAuthContext();

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else if (err instanceof ForgotPasswordError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    success,
    handleForgotPassword,
    reset,
  };
};
