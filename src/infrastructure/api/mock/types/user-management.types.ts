/**
 * User Management Types and Schemas
 * Defines TypeScript types and Zod validation schemas for the user management system.
 */
import { z } from 'zod';

import { User } from '@/domain/models/user/types';

import { UserSchema } from './auth.types';

// ==================== Extended User Schema ====================
/**
 * Extended user schema with admin-specific fields
 */
export const ExtendedUserSchema = UserSchema.extend({
  role: z.enum(['admin', 'user']),
  status: z.enum(['Active', 'Deactive', 'Pending']),
  registrationDate: z.string().optional(),
});

// ==================== Request Schemas ====================
/**
 * Schema for activating a pending user
 */
export const ActivateUserRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

/**
 * Schema for deactivating an active user
 */
export const DeactivateUserRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

// ==================== Response Schemas ====================
/**
 * Schema for user list response
 */
export const UserListResponseSchema = z.object({
  users: z.array(ExtendedUserSchema),
});

// ==================== Type Exports ====================
export type ExtendedUser = z.infer<typeof ExtendedUserSchema>;
export type ActivateUserRequest = z.infer<typeof ActivateUserRequestSchema>;
export type DeactivateUserRequest = z.infer<typeof DeactivateUserRequestSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;

/**
 * User Management API Response Types
 */

// GET /api/users response
export type GetUsersResponse = User[];

// POST /api/users/activate response
export type ActivateUserResponse = User;

// POST /api/users/deactivate response
export type DeactivateUserResponse = User;

// Request body types
export interface UserIdRequest {
  userId: string;
}
