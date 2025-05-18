import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { type User } from '@/domain/models/user/types';
import { useUserManagementService } from '@/presentation/features/admin/context/UserManagementContext';
import { UserQueryParams, UserPaginationResponse } from '@/domain/interfaces/user/IUserManagementRepository';

export const USER_MANAGEMENT_QUERY_KEY = ['users'] as const;

export function useUserManagement(params?: UserQueryParams) {
  const userManagementService = useUserManagementService();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<UserPaginationResponse>({
    queryKey: [...USER_MANAGEMENT_QUERY_KEY, params],
    queryFn: () => userManagementService.getUsersWithParams(params),
  });

  const { mutate: updateUserRole } = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'USER' | 'TEAM_MEMBER' }) =>
      userManagementService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });

  const { mutate: updateTeamRole } = useMutation({
    mutationFn: ({ teamId, role }: { teamId: number; role: 'TEAM_MEMBER' | 'TECH_LEAD' }) =>
      userManagementService.updateTeamRole(teamId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });

  return {
    users: data?.users || [],
    pagination: data?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
    isLoading,
    error,
    updateUserRole,
    updateTeamRole,
  };
} 