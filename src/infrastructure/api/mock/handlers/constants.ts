export const COMMON_ERRORS = {
  UNAUTHORIZED: {
    code: 'COMMON_001',
    message: 'Unauthorized access',
  },
  RATE_LIMITED: {
    code: 'COMMON_002',
    message: 'Too many attempts. Try again later',
  },
  SERVER_ERROR: {
    code: 'COMMON_500',
    message: 'An unexpected error occurred',
  },
  INVALID_INPUT: {
    code: 'COMMON_400',
    message: 'Invalid input',
  },
} as const;

export type CommonErrorCode = keyof typeof COMMON_ERRORS;
