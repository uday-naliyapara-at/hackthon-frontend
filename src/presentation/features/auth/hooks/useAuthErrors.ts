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

  const handleAuthError = (err: unknown) => {
    let errorData: AuthError | null = null;

    if (err instanceof EmailExistsError) {
      errorData = {
        message: err.message,
        field: 'email',
      };
    } else if (err instanceof ValidationError) {
      errorData = {
        message: err.message,
        details: err.details,
      };
    } else if (err instanceof UnauthorizedError) {
      errorData = {
        message: err.message,
      };
    } else if (err instanceof AccountLockedError) {
      errorData = {
        message: err.message,
        details: { lockoutDuration: err.lockoutDuration },
      };
    } else if (err instanceof AccountNotApprovedError) {
      errorData = {
        message: err.message,
      };
    } else if (err instanceof RateLimitError) {
      errorData = {
        message: err.message,
        details: { retryAfter: err.retryAfter },
      };
    } else if (err instanceof NetworkError) {
      errorData = {
        message: 'Network error occurred. Please try again.',
      };
    } else if (err instanceof Error) {
      errorData = {
        message: err.message,
      };
    } else {
      errorData = {
        message: 'An unexpected error occurred',
      };
    }

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
