import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useCallback } from "react";

import { SessionState } from "@/domain/models/auth/types";
import { UserEntity } from "@/domain/models/user/User";

import { useAuthContext } from "../context/AuthContext";

// Authentication query key - export it for use in other hooks
export const AUTH_QUERY_KEY = ["auth", "session"];
const LOCAL_STORAGE_USER_KEY = "auth_user";

/**
 * Custom hook for authentication state management
 * Provides user session data, authentication status, and loading state
 */
export const useAuth = (): SessionState => {
  const { sessionService, authService } = useAuthContext();
  const queryClient = useQueryClient();

  const validateSession = useCallback(async () => {
    try {
      // First check localStorage for user data
      const storedUserData = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        // Set the cached data
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        return user;
      }

      // If no stored data, check cache
      const cachedUser = queryClient.getQueryData<UserEntity>(AUTH_QUERY_KEY);
      if (cachedUser) {
        // Store in localStorage for persistence
        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify(cachedUser)
        );
        return cachedUser;
      }

      // If no cached data, validate session with backend
      const isValid = await sessionService.checkAuthStatus();
      if (!isValid) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        return null;
      }

      const user = await sessionService.validateSession();
      if (!user) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        return null;
      }

      // Store the user data
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      // Clear cached user data on validation errors
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      console.error("Session validation failed:", error);
      return null;
    }
  }, [sessionService, authService, queryClient]);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<UserEntity | null, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: validateSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Only retry once, and not for authentication errors
      if (
        failureCount > 0 ||
        (error.message && error.message.includes("auth"))
      ) {
        return false;
      }
      return true;
    },
  });

  if (error) {
    console.error("Auth error:", error);
  }

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};
