import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { type User } from '@/domain/models/user/types';
import { useUserManagementService } from '@/presentation/features/admin/context/UserManagementContext';

export const USER_MANAGEMENT_QUERY_KEY = ['users'] as const;

export function useUserManagement() {
  const userManagementService = useUserManagementService();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: USER_MANAGEMENT_QUERY_KEY,
    queryFn: () => userManagementService.getAllUsers(),
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
    users,
    isLoading,
    error,
    updateUserRole,
    updateTeamRole,
  };
} 