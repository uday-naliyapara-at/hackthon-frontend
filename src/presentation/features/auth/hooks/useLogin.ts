import { useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoginDTO } from '../../../../domains/models/user/types';
import { useAuthContext } from '../context/AuthContext';
import { AUTH_QUERY_KEY } from './useAuth';

interface UseLoginOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseLoginReturn {
  login: (credentials: LoginDTO) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Hook for handling login functionality
 * Manages loading state, error handling, and navigation after successful login
 */
export const useLogin = (options: UseLoginOptions = {}): UseLoginReturn => {
  const { redirectTo = '/home', onSuccess, onError } = options;
  const navigate = useNavigate();
  const { authService } = useAuthContext();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: Error) => {
    setError(error);
    onError?.(error);
  };

  const login = async (credentials: LoginDTO): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.login(credentials);

      // Invalidate auth query to force a refetch
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

      onSuccess?.();
      navigate(redirectTo);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};
