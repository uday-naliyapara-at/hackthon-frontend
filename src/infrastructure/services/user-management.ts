import { IUserManagementService } from '@/domain/interfaces/user/IUserManagementService';
import { User } from '@/domain/models/user/types';
import { UserPaginationResponse, UserQueryParams } from '@/domain/interfaces/user/IUserManagementRepository';

class UserManagementService implements IUserManagementService {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch('/api/admin/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }

  async getUsersWithParams(params?: UserQueryParams): Promise<UserPaginationResponse> {
    const queryString = params
      ? `?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : '';
    const response = await fetch(`/api/admin/users${queryString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }

  async activateUser(userId: string): Promise<User> {
    const response = await fetch(`/api/admin/users/${userId}/activate`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to activate user');
    }
    return response.json();
  }

  async deactivateUser(userId: string): Promise<User> {
    const response = await fetch(`/api/admin/users/${userId}/deactivate`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to deactivate user');
    }
    return response.json();
  }
}

export const userManagementService = new UserManagementService(); 