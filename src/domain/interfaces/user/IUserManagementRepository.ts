import { User } from "@/domain/models/user/types";

/**
 * Pagination response structure for user listings
 */
export interface UserPaginationResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Parameters for filtering and pagination of user lists
 */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  status?: "Pending" | "Active" | "Deactive";
  sortBy?: "createdAt" | "firstName" | "lastName" | "email" | "status";
  sortOrder?: "asc" | "desc";
  searchText?: string;
}

/**
 * Repository interface for user management functionality
 */
export interface IUserManagementRepository {
  /**
   * Get all users
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ForbiddenError} When user does not have admin privileges
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Get paginated user list with filtering and sorting
   * @param params Pagination and filtering parameters
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ForbiddenError} When user does not have admin privileges
   * @throws {ValidationError} When query parameters are invalid
   */
  getUsersWithParams(params?: UserQueryParams): Promise<UserPaginationResponse>;

  /**
   * Update user's role
   * @param userId ID of the user to update
   * @param role New role to assign
   * @returns Updated user entity
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ForbiddenError} When user does not have admin privileges
   * @throws {NotFoundError} When user is not found
   */
  updateUserRole(
    userId: number,
    role: "TECH_LEAD" | "TEAM_MEMBER"
  ): Promise<User>;

  /**
   * Activate a pending user
   * @param userId User ID to activate
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ForbiddenError} When user does not have admin privileges
   * @throws {NotFoundError} When user is not found
   * @throws {ValidationError} When user status is not pending
   */
  activateUser(userId: string): Promise<User>;

  /**
   * Deactivate an active user
   * @param userId User ID to deactivate
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ForbiddenError} When user does not have admin privileges
   * @throws {NotFoundError} When user is not found
   * @throws {ValidationError} When user status is not active
   */
  deactivateUser(userId: string): Promise<User>;
}
