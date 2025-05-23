import { useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { AUTH_QUERY_KEY } from './useAuth';

interface UseLogoutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const LOCAL_STORAGE_USER_KEY = 'auth_user';

export const useLogout = (options: UseLogoutOptions = {}): UseLogoutReturn => {
  const { redirectTo = '/auth/login', onSuccess, onError } = options;
  const navigate = useNavigate();
  const { authService } = useAuthContext();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
    onError?.(error);
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.logout();

      // Clear all stored auth data
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      queryClient.setQueryData(AUTH_QUERY_KEY, null);

      // Remove queries instead of invalidating them to prevent unnecessary refetching
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey[0] === 'auth' ||
          query.queryKey[0] === 'user' ||
          query.queryKey[0] === 'chat',
      });

      onSuccess?.();
      navigate(redirectTo);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
};
