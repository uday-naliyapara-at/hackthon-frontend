import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/presentation/shared/atoms/Toast';

import { useAuthContext } from '../context/AuthContext';

interface UseResetPasswordReturn {
  isLoading: boolean;
  error: Error | null;
  success: boolean;
  handleResetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const { authService } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = useCallback(
    async (token: string, password: string) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await authService.resetPassword(token, password);
        setSuccess(true);
        toast({
          description: 'Password reset successful. Redirecting to login...',
        });
        // Redirect to login after successful password reset
        setTimeout(() => navigate('/auth/login'), 2000);
      } catch (err) {
        const error = err as Error;
        setError(error);
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    [authService, navigate, toast]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    success,
    handleResetPassword,
    clearError,
  };
};
