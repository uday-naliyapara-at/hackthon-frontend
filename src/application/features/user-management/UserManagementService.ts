import { IUserManagementRepository, IUserManagementService, UserPaginationResponse, UserQueryParams } from '@/domain/interfaces/user';
import { User } from '@/domain/models/user/types';

/**
 * Service class for handling user management business logic
 * Coordinates between domain and infrastructure layers
 */
export class UserManagementService implements IUserManagementService {
  constructor(private readonly userManagementRepository: IUserManagementRepository) {}

  /**
   * Get all users in the system
   * @returns Array of users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await this.userManagementRepository.getAllUsers();
    return response;
  }

  /**
   * Get users with pagination and filtering
   * @param params Query parameters for pagination and filtering
   * @returns Paginated array of users
   */
  async getUsersWithParams(params?: UserQueryParams): Promise<UserPaginationResponse> {
    return this.userManagementRepository.getUsersWithParams(params);
  }

  /**
   * Update user's role
   * @param userId ID of the user to update
   * @param role New role to assign
   * @returns Updated user entity
   */
  async updateUserRole(userId: number, role: 'USER' | 'TEAM_MEMBER'): Promise<User> {
    return this.userManagementRepository.updateUserRole(userId, role);
  }

  /**
   * Activate a pending user
   * @param userId ID of the user to activate
   * @returns The activated user
   */
  async activateUser(userId: string): Promise<User> {
    return this.userManagementRepository.activateUser(userId);
  }

  /**
   * Deactivate an active user
   * @param userId ID of the user to deactivate
   * @returns The deactivated user
   */
  async deactivateUser(userId: string): Promise<User> {
    return this.userManagementRepository.deactivateUser(userId);
  }

  /**
   * Update user's team role
   * @param teamId ID of the team
   * @param role New role to assign
   * @returns Updated user entity
   */
  async updateTeamRole(teamId: number, role: 'TEAM_MEMBER' | 'TECH_LEAD'): Promise<User> {
    return this.userManagementRepository.updateTeamRole(teamId, role);
  }
} 