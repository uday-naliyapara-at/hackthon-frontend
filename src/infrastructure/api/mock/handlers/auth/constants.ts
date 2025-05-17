import { COMMON_ERRORS } from '../constants';

export const AUTH_ERRORS = {
  // Authentication errors
  INVALID_CREDENTIALS: {
    code: 'AUTH_006',
    message: 'Invalid email or password',
  },
  ACCOUNT_PENDING: {
    code: 'AUTH_007',
    message: 'Your account is awaiting activation by an administrator',
  },
  ACCOUNT_DEACTIVATED: {
    code: 'AUTH_008',
    message: 'Your account has been deactivated. Please contact an administrator',
  },
  INVALID_SESSION: {
    code: 'AUTH_009',
    message: 'Invalid session or session expired',
  },
  ACCOUNT_LOCKED: {
    code: 'AUTH_016',
    message: 'Account temporarily locked. Try again later',
  },

  // Registration errors
  EMAIL_EXISTS: {
    code: 'AUTH_001',
    message: 'Email already registered',
  },

  // Token errors
  TOKEN_EXPIRED: {
    code: 'AUTH_003',
    message: 'Token has expired',
  },
  INVALID_TOKEN: {
    code: 'AUTH_004',
    message: 'Invalid token format or signature',
  },
  INVALID_REFRESH_TOKEN: {
    code: 'AUTH_005',
    message: 'Invalid refresh token',
  },

  // User errors
  USER_NOT_FOUND: {
    code: 'AUTH_010',
    message: 'User not found',
  },
  AUTH_UNAUTHORIZED: {
    code: 'AUTH_011',
    message: 'Unauthorized access',
  },
  USER_ALREADY_ACTIVATED: {
    code: 'AUTH_012',
    message: 'User is already activated',
  },
  USER_ALREADY_DEACTIVATED: {
    code: 'AUTH_013',
    message: 'User is already deactivated',
  },

  // Rate limiting
  AUTH_RATE_LIMIT_EXCEEDED: {
    code: 'AUTH_014',
    message: 'Too many attempts. Try again later',
  },

  // Token blacklist error
  TOKEN_BLACKLIST_ERROR: {
    code: 'AUTH_015',
    message: 'Token has been invalidated',
  },

  // Include necessary common errors
  SERVER_ERROR: COMMON_ERRORS.SERVER_ERROR,
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERRORS;
