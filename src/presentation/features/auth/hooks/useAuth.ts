import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useCallback } from 'react';

import { SessionState } from '@/domains/models/auth/types';
import { User } from '@/domain/models/user/types';

import { useAuthContext } from '../context/AuthContext';

// Authentication query key - export it for use in other hooks
export const AUTH_QUERY_KEY = ['auth', 'session'];

/**
 * Custom hook for authentication state management
 * Provides user session data, authentication status, and loading state
 */
export const useAuth = (): SessionState => {
  const { sessionService } = useAuthContext();
  const queryClient = useQueryClient();

  const validateSession = useCallback(async () => {
    try {
      return await sessionService.validateSession();
    } catch (error) {
      // Clear cached user data on validation errors
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      console.error('Session validation failed:', error);
      return null;
    }
  }, [sessionService, queryClient]);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: validateSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Only retry once, and not for authentication errors
      if (failureCount > 0 || (error.message && error.message.includes('auth'))) {
        return false;
      }
      return true;
    },
  });

  if (error) {
    console.error('Auth error:', error);
  }

  return {
    isAuthenticated: !!user,
    isLoading,
    user: user || null,
  };
};
