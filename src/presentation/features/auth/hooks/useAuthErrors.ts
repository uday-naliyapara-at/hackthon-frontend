import { useState } from 'react';

import {
  AccountLockedError,
  AccountNotApprovedError,
  EmailExistsError,
  NetworkError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from '@/application/features/auth/errors';

interface AuthError {
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export const useAuthErrors = () => {
  const [error, setError] = useState<AuthError | null>(null);
  console.log("error", error)

  const handleAuthError = (err: unknown) => {
    let errorData: AuthError | null = null;

    if (err instanceof EmailExistsError) {
      console.log("27")
      errorData = {
        message: err.message,
        field: 'email',
      };
    } else if (err instanceof ValidationError) {
      console.log("33")
      errorData = {
        message: err.message,
        details: err.details,
      };
    } else if (err instanceof UnauthorizedError) {
      console.log("39")
      errorData = {
        message: err.message,
      };
    } else if (err instanceof AccountLockedError) {
      console.log("45")
      errorData = {
        message: err.message,
        details: { lockoutDuration: err.lockoutDuration },
      };
    } else if (err instanceof AccountNotApprovedError) {
      console.log("51")
      errorData = {
        message: err.message,
      };
    } else if (err instanceof RateLimitError) {
      console.log("57")
      errorData = {
        message: err.message,
        details: { retryAfter: err.retryAfter },
      };
    } else if (err instanceof NetworkError) {
      console.log("63")
      errorData = {
        message: 'Network error occurred. Please try again.',
      };
    } else if (err instanceof Error) {
      console.log("69")
      errorData = {
        message: err.message,
      };
    } else {
      console.log("75")
      errorData = {
        message: 'An unexpected error occurred',
      };
    }

    console.log("errorData", errorData)
    setError(errorData);
    return errorData;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    handleAuthError,
    clearError,
  };
};
