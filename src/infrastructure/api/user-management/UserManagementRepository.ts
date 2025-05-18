import {
  AdminPrivilegeError,
  InvalidUserStatusError,
  UserActivationError,
  UserDeactivationError,
  UserNotFoundError,
} from "@/application/features/user-management/errors";
import {
  IUserManagementRepository,
  IUserManagementService,
  UserPaginationResponse,
  UserQueryParams,
} from "@/domain/interfaces/user";
import { User } from "@/domain/models/user/types";
import { IHttpClient } from "@/infrastructure/utils/http/types";

import {
  BaseErrorResponse,
  BaseRepository,
  HttpStatusCode,
} from "../BaseRepository";

// User Management specific error codes
export enum UserManagementErrorCode {
  USER_NOT_FOUND = "USER_MGMT_001",
  INVALID_STATUS = "USER_MGMT_002",
  ACTIVATION_FAILED = "USER_MGMT_003",
  DEACTIVATION_FAILED = "USER_MGMT_004",
  ADMIN_REQUIRED = "USER_MGMT_005",
}

/**
 * Repository implementation for user management
 * Follows infrastructure layer patterns by extending BaseRepository
 * and implementing domain repository interface
 */
export class UserManagementRepository
  extends BaseRepository
  implements IUserManagementRepository, IUserManagementService
{
  private readonly baseUrl = "/users";
  private readonly authBaseUrl = "/auth/users";

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  /**
   * Get all users in the system
   * For compatibility with the interface
   * @returns Array of users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.httpClient.get<{
        success: boolean;
        data: { users: User[] };
      }>(this.baseUrl);
      return response.data.users;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search users by query text
   * @param searchText The search query
   * @param params Additional query parameters
   * @returns Paginated array of users with pagination metadata
   */
  private async searchUsers(
    searchText: string,
    params?: Omit<UserQueryParams, "searchText">
  ): Promise<UserPaginationResponse> {
    try {
      const url = `${this.authBaseUrl}/search?searchText=${encodeURIComponent(
        searchText
      )}`;
      const response = await this.httpClient.get<{
        success: boolean;
        data: { users: User[]; total: number };
      }>(url);
      return {
        users: response.data.users,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalItems: response.data.total,
          totalPages: Math.ceil(response.data.total / (params?.limit || 10)),
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get users in the system with pagination, filtering and sorting
   * Extended functionality for UI components that need pagination
   * @param params Query parameters for pagination, filtering and sorting
   * @returns Paginated array of users with pagination metadata
   */
  async getUsersWithParams(
    params?: UserQueryParams
  ): Promise<UserPaginationResponse> {
    try {
      // If searchText is present, use the search endpoint
      if (params?.searchText) {
        const { searchText, ...otherParams } = params;
        return this.searchUsers(searchText, otherParams);
      }

      // Build query parameters for regular listing
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const queryString = queryParams.toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      const response = await this.httpClient.get<{
        success: boolean;
        data: { users: User[]; total: number };
      }>(url);
      return {
        users: response.data.users,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalItems: response.data.total,
          totalPages: Math.ceil(response.data.total / (params?.limit || 10)),
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Activate a pending user
   * @param userId ID of the user to activate
   * @returns The activated user
   */
  async activateUser(userId: string): Promise<User> {
    try {
      // Use PATCH as defined in the API schema
      const response = await this.httpClient.patch<User>(
        `${this.baseUrl}/${userId}/activate`,
        {}
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Deactivate an active user
   * @param userId ID of the user to deactivate
   * @returns The deactivated user
   */
  async deactivateUser(userId: string): Promise<User> {
    try {
      // Use PATCH as defined in the API schema
      const response = await this.httpClient.patch<User>(
        `${this.baseUrl}/${userId}/deactivate`,
        {}
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user's role
   * @param userId ID of the user to update
   * @param role New role to assign
   * @returns Updated user entity
   */
  async updateUserRole(
    userId: number,
    role: "TECH_LEAD" | "TEAM_MEMBER"
  ): Promise<User> {
    try {
      const response = await this.httpClient.put<User>(
        `${this.baseUrl}/updateRole`,
        {
          userId,
          role,
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected override handleErrorCode(
    code: string,
    message: string
  ): Error | null {
    switch (code) {
      case UserManagementErrorCode.USER_NOT_FOUND:
        return new UserNotFoundError(message);
      case UserManagementErrorCode.INVALID_STATUS:
        return new InvalidUserStatusError(message, "unknown", "Pending");
      case UserManagementErrorCode.ACTIVATION_FAILED:
        return new UserActivationError("unknown", message);
      case UserManagementErrorCode.DEACTIVATION_FAILED:
        return new UserDeactivationError("unknown", message);
      case UserManagementErrorCode.ADMIN_REQUIRED:
        return new AdminPrivilegeError();
      default:
        return null;
    }
  }

  /**
   * Override to handle specific HTTP status codes
   */
  protected override handleErrorResponse(errorData: BaseErrorResponse): Error {
    // First try specific error codes
    if (errorData.code) {
      const error = this.handleErrorCode(errorData.code, errorData.message);
      if (error) return error;
    }

    // Then handle HTTP status codes
    switch (errorData.status) {
      case HttpStatusCode.NOT_FOUND:
        return new UserNotFoundError(errorData.message);
      case HttpStatusCode.FORBIDDEN:
        return new AdminPrivilegeError();
      case HttpStatusCode.BAD_REQUEST:
        // For invalid status errors that were previously 422
        if (errorData.message?.includes("status")) {
          return new InvalidUserStatusError("unknown", "unknown", "Pending");
        }
      // Fall through to default for other 400 errors
      default:
        return super.handleErrorResponse(errorData);
    }
  }
}
