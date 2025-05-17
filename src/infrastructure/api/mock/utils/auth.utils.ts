/**
 * Authentication Utilities
 *
 * This module provides core authentication functionality including:
 * - JWT token generation and verification
 * - Password hashing and verification
 * - User data sanitization
 * - Rate limiting and account security
 * - Error response formatting
 */
import { compare, hash } from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
import jwtEncode from 'jwt-encode';
import { v4 as uuidv4 } from 'uuid';

import { authStore } from '../data/auth.store';
import { StoredUser, Tokens, User } from '../types/auth.types';
import { extractBearerToken } from './auth';

// Configuration constants
const JWT_SECRET = 'your-jwt-secret-key'; // In production, use environment variable
const SALT_ROUNDS = 10;

// ==================== Token Management ====================
/**
 * Generates access and refresh tokens for a user
 * - Access token expires in 15 minutes
 * - Refresh token expires in 7 days
 *
 * @param user The user object to generate tokens for
 * @returns Object containing access and refresh tokens
 */
export const generateTokens = (user: User): Tokens => {
  const accessTokenPayload = {
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
  };

  const refreshTokenPayload = {
    userId: user.id,
    tokenId: uuidv4(),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const accessToken = jwtEncode(accessTokenPayload, JWT_SECRET);
  const refreshToken = jwtEncode(refreshTokenPayload, JWT_SECRET);

  return { accessToken, refreshToken };
};

/**
 * Verifies and decodes a JWT token
 * Checks for token expiration
 *
 * @param token The JWT token to verify
 * @returns Decoded token payload if valid, null if invalid or expired
 */
export const verifyToken = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (typeof decoded === 'object' && decoded !== null && 'exp' in decoded) {
      if (decoded.exp && decoded.exp < now) {
        return null;
      }
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
};

// ==================== Password Management ====================
/**
 * Hashes a password using bcrypt
 *
 * @param password The plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, SALT_ROUNDS);
};

/**
 * Verifies a password against its hash
 *
 * @param password The plain text password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return compare(password, hashedPassword);
};

// ==================== Token Generation ====================
/**
 * Generates a verification token for email verification or password reset
 * Uses UUID v4 for secure random token generation
 *
 * @returns A unique verification token
 */
export const generateVerificationToken = (): string => {
  return uuidv4();
};

// ==================== User Data Management ====================
/**
 * Removes sensitive information from user object
 * Strips out password hash and security-related fields
 *
 * @param user The stored user object with sensitive data
 * @returns Sanitized user object safe for client response
 */
export const sanitizeUser = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  password,
  failedLoginAttempts,
  lastFailedLogin,
  lockoutUntil,
  ...sanitizedUser
}: StoredUser): User => {
  return sanitizedUser;
};

// ==================== Security Management ====================
/**
 * Checks if a user account is currently locked
 *
 * @param user The user object to check
 * @returns True if account is locked, false otherwise
 */
export const isUserLocked = (user: StoredUser): boolean => {
  if (!user.lockoutUntil) return false;
  return new Date() < user.lockoutUntil;
};

/**
 * Determines if a user account should be locked based on failed attempts
 * Implements a 5-minute window for tracking failed attempts
 *
 * @param user The user object to check
 * @returns True if account should be locked, false otherwise
 */
export const shouldLockUser = (user: StoredUser): boolean => {
  if (!user.lastFailedLogin) return false;

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return user.lastFailedLogin > fiveMinutesAgo && user.failedLoginAttempts >= 5;
};

// ==================== Error Handling ====================
/**
 * Creates a standardized error response object
 *
 * @param code Error code for client handling
 * @param message User-friendly error message
 * @param details Optional additional error details
 * @returns Formatted error response object
 */
export const createErrorResponse = (
  code: string,
  message: string,
  details?: Record<string, unknown>
) => {
  return {
    code,
    message,
    ...(details && { details }),
  };
};

/**
 * Extracts the user ID from the authorization header
 * @param authHeader The Authorization header value
 * @returns The user ID or null if not found/invalid
 */
export async function getUserIdFromAuthHeader(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;

  const token = extractBearerToken(authHeader);
  if (!token) return null;

  const sessions = Array.from((await authStore.getAllSessions()).values());
  const session = sessions.find((s) => s.accessToken === token);

  return session?.userId || null;
}
