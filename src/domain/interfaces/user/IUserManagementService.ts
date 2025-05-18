import { User } from '@/domain/models/user/types';

import { UserPaginationResponse, UserQueryParams } from './IUserManagementRepository';

/**
 * Service interface for user management operations
 */
export interface IUserManagementService {
  /**
   * Get all users in the system
   * @returns Array of user entities
   * @throws UnauthorizedError when user is not authenticated
   * @throws AdminPrivilegeError when user is not an admin
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Get paginated user list with filtering and sorting
   * @param params Pagination and filtering parameters
   * @returns Paginated list of users
   * @throws UnauthorizedError when user is not authenticated
   * @throws AdminPrivilegeError when user is not an admin
   * @throws ValidationError when query parameters are invalid
   */
  getUsersWithParams(params?: UserQueryParams): Promise<UserPaginationResponse>;

  /**
   * Update user's role
   * @param userId ID of the user to update
   * @param role New role to assign
   * @returns Updated user entity
   * @throws UnauthorizedError when user is not authenticated
   * @throws AdminPrivilegeError when user is not an admin
   * @throws UserNotFoundError when user is not found
   */
  updateUserRole(
    userId: number,
    role: "TECH_LEAD" | "TEAM_MEMBER"
  ): Promise<User>;

  /**
   * Activate a pending user
   * @param userId ID of the user to activate
   * @returns The activated user entity
   * @throws UnauthorizedError when user is not authenticated
   * @throws AdminPrivilegeError when user is not an admin
   * @throws UserNotFoundError when user is not found
   * @throws InvalidUserStatusError when user is not in pending status
   */
  activateUser(userId: string): Promise<User>;

  /**
   * Deactivate an active user
   * @param userId ID of the user to deactivate
   * @returns The deactivated user entity
   * @throws UnauthorizedError when user is not authenticated
   * @throws AdminPrivilegeError when user is not an admin
   * @throws UserNotFoundError when user is not found
   * @throws InvalidUserStatusError when user is not in active status
   */
  deactivateUser(userId: string): Promise<User>;

  /**
   * Update user's team role
   * @param teamId ID of the team
   * @param role New role to assign
   * @returns Updated user entity
   * @throws UnauthorizedError when user is not authenticated
   * @throws AdminPrivilegeError when user is not an admin
   * @throws UserNotFoundError when user is not found
   */
      }
