/**
 * Authentication Types and Schemas
 * This file defines all the TypeScript types and Zod validation schemas for the authentication system.
 * It serves as the single source of truth for:
 * 1. Request/Response shapes
 * 2. Data validation rules
 * 3. Type safety throughout the auth system
 */
import { z } from 'zod';

// ==================== Request Schemas ====================
/**
 * Schema for user registration requests
 * Validates:
 * - Email format
 * - Password minimum length
 * - Required first and last names
 */
export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

/**
 * Schema for user login requests
 * Validates:
 * - Email format
 * - Password presence
 */
export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for token refresh requests
 * Validates:
 * - Refresh token presence
 */
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * Schema for forgot password requests
 * Validates:
 * - Email format
 */
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Schema for password reset requests
 * Validates:
 * - New password minimum length
 */
export const ResetPasswordRequestSchema = z.object({
  password: z.string().min(8, 'New password must be at least 8 characters long'),
});

/**
 * Schema for resend verification requests
 * Validates:
 * - Email format
 */
export const ResendVerificationRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// ==================== Response Schemas ====================
/**
 * Schema for user data in responses
 * Defines the public user profile without sensitive data
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  emailVerified: z.boolean(),
  role: z.enum(['admin', 'user']).optional(),
  status: z.enum(['Active', 'Deactive', 'Pending']).optional(),
});

/**
 * Schema for authentication tokens
 * Includes both access and refresh tokens
 */
export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

/**
 * Schema for authentication responses
 * Combines user profile and authentication tokens
 */
export const AuthResponseSchema = z.object({
  user: UserSchema,
  tokens: TokensSchema,
});

/**
 * Schema for error responses
 * Provides structured error information
 */
export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

// ==================== Type Exports ====================
// Request Types
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type ResendVerificationRequest = z.infer<typeof ResendVerificationRequestSchema>;

// Response Types
export type User = z.infer<typeof UserSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Response type for the GET /api/auth/me endpoint
 */
export interface GetCurrentUserResponse {
  user: User;
}

// ==================== Internal Store Types ====================
/**
 * Extended user type for internal storage
 * Includes sensitive and security-related fields
 */
export interface StoredUser extends Omit<User, 'id'> {
  id: string;
  password: string;
  failedLoginAttempts: number;
  lastFailedLogin?: Date;
  lockoutUntil?: Date;
}

/**
 * Type for email verification and password reset tokens
 */
export interface VerificationToken {
  token: string;
  userId: string;
  expiresAt: Date;
  type: 'email' | 'reset';
}

/**
 * Type for user sessions
 * Used for refresh token management
 */
export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: Date;
}
