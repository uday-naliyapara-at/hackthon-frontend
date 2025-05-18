import { useState, useEffect, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import debounce from 'lodash/debounce';
import { Button } from '@/presentation/shared/atoms/Button';
import { Input } from '@/presentation/shared/atoms/Input';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner';
import { useUserManagement, USER_MANAGEMENT_QUERY_KEY } from '@/presentation/features/admin/hooks/useUserManagement';
import { useTeams } from '@/presentation/hooks/useTeams';
import { useTeamContext } from '@/presentation/features/team/context/TeamContext';
import { UserRole } from '@/domain/models/user/types';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { HiPencilSquare, HiUserGroup, HiUsers } from 'react-icons/hi2';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHttpClient } from '@/infrastructure/utils/http/httpClientFactory';
import { useAuthContext } from '@/presentation/features/auth/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Team } from '@/domain/models/team/types';

// User interface for the component
interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  teamId: number | null;
}

// Define role options for the dropdown
const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'TECH_LEAD', label: 'Tech Lead' },
  { value: 'TEAM_MEMBER', label: 'Team Member' }
];

// Helper function to get user initials
const getUserInitials = (fullName: string): string => {
  if (!fullName) return '';

  const names = fullName.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// Helper function to get team initials
const getTeamInitials = (teamName: string): string => {
  if (!teamName) return '';

  const words = teamName.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return teamName[0].toUpperCase();
};

export function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('user-management');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { users, pagination, isLoading, updateUserRole, updateTeamRole } = useUserManagement({
    page: currentPage,
    limit: 10,
    searchText: searchQuery,
  });
  const { teamService } = useTeamContext();
  const { data: teams, isLoading: isLoadingTeams } = useTeams(teamService);
  const { toast } = useToast();
  const { sessionService } = useAuthContext();
  const queryClient = useQueryClient();

  // Edit user state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedTeamId, setEditedTeamId] = useState<number | null>(null);
  const [editedRole, setEditedRole] = useState<UserRole | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Edit team state
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editedTeamName, setEditedTeamName] = useState<string>('');
  const [isTeamFormChanged, setIsTeamFormChanged] = useState(false);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Delete team confirmation state
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  // Create team state
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // Create HTTP client for direct API calls
  const createClient = useCallback(async () => {
    return createHttpClient(async () => {
      try {
        return await sessionService.refreshAccessToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
      }
    });
  }, [sessionService]);

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, role, teamId }: { userId: number; role?: UserRole; teamId?: number | null }) => {
      const client = await createClient();
      const payload: any = { userId };
      
      // Add role or teamId as required
      if (role) payload.role = role;
      if (teamId !== undefined) payload.teamId = teamId;
      
      const response = await client.put('/users/updateRole', payload);
      return response;
    },
    onMutate: async ({ userId, role, teamId }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
      
      // Snapshot the previous users data
      const previousUsers = queryClient.getQueryData([...USER_MANAGEMENT_QUERY_KEY, { page: currentPage, limit: 10, searchText: searchQuery }]);
      
      // Optimistically update the cache with the new user data
      queryClient.setQueryData([...USER_MANAGEMENT_QUERY_KEY, { page: currentPage, limit: 10, searchText: searchQuery }], (old: any) => {
        if (!old || !old.users) return old;
        
        return {
          ...old,
          users: old.users.map((user: any) => {
            if (user.id === userId) {
              return {
                ...user,
                ...(role && { role }),
                ...(teamId !== undefined && { teamId }),
              };
            }
            return user;
          }),
        };
      });
      
      return { previousUsers };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, revert to the previous users state
      if (context?.previousUsers) {
        queryClient.setQueryData(
          [...USER_MANAGEMENT_QUERY_KEY, { page: currentPage, limit: 10, searchText: searchQuery }],
          context.previousUsers
        );
      }
      
      toast({
        title: 'Update Failed',
        description: error?.message || 'User not found or role update failed',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User updated successfully',
        variant: 'success',
      });
      
      // Invalidate the users query to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
      
      // Close the dialog
      setIsEditDialogOpen(false);
    },
    onSettled: () => {
      // Always refetch after error or success to make sure our local data is correct
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      // Implementing a custom fetch since our httpClient doesn't support DELETE with a body
      const accessToken = localStorage.getItem('accessToken');
      const baseUrl = 'https://hackathon-backend-h5uq.onrender.com/api/public';
      
      // Create URLSearchParams for form-urlencoded body
      const formData = new URLSearchParams();
      formData.append('userId', userId.toString());
      
      const response = await fetch(`${baseUrl}/users/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(accessToken ? { 'Authorization': accessToken } : {})
        },
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      // Return empty response or parse the response if needed
      const text = await response.text();
      return text ? JSON.parse(text) : undefined;
    },
    onMutate: async (userId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
      
      // Snapshot the previous users data
      const previousUsers = queryClient.getQueryData([...USER_MANAGEMENT_QUERY_KEY, { page: currentPage, limit: 10, searchText: searchQuery }]);
      
      // Optimistically update the cache by removing the deleted user
      queryClient.setQueryData([...USER_MANAGEMENT_QUERY_KEY, { page: currentPage, limit: 10, searchText: searchQuery }], (old: any) => {
        if (!old || !old.users) return old;
        
        return {
          ...old,
          users: old.users.filter((user: any) => user.id !== userId),
        };
      });
      
      return { previousUsers };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, revert to the previous users state
      if (context?.previousUsers) {
        queryClient.setQueryData(
          [...USER_MANAGEMENT_QUERY_KEY, { page: currentPage, limit: 10, searchText: searchQuery }],
          context.previousUsers
        );
      }
      
      toast({
        title: 'Delete Failed',
        description: error?.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'success',
      });
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Invalidate the users query to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: USER_MANAGEMENT_QUERY_KEY });
    },
  });

  // Team edit mutation
  const updateTeamMutation = useMutation({
    mutationFn: async ({ teamId, name }: { teamId: number; name: string }) => {
      const client = await createClient();
      const response = await client.put(`/teams/${teamId}`, { name });
      return response;
    },
    onMutate: async ({ teamId, name }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      
      // Snapshot the previous teams data
      const previousTeams = queryClient.getQueryData(['teams']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['teams'], (old: any) => {
        if (!old) return old;
        
        return old.map((team: Team) => {
          if (team.id === teamId) {
            return { ...team, name };
          }
          return team;
        });
      });
      
      return { previousTeams };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, revert to the previous teams state
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      
      toast({
        title: 'Update Failed',
        description: error?.message || 'Team update failed',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Team updated successfully',
        variant: 'success',
      });
      
      // Invalidate the teams query to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      // Close the dialog
      setIsEditTeamDialogOpen(false);
    }
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const client = await createClient();
      const response = await client.delete(`/teams/${teamId}`);
      return response;
    },
    onMutate: async (teamId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      
      // Snapshot the previous teams data
      const previousTeams = queryClient.getQueryData(['teams']);
      
      // Optimistically update the cache by removing the deleted team
      queryClient.setQueryData(['teams'], (old: any) => {
        if (!old) return old;
        
        return old.filter((team: Team) => team.id !== teamId);
      });
      
      return { previousTeams };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, revert to the previous teams state
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      
      toast({
        title: 'Delete Failed',
        description: error?.message || 'Failed to delete team',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Team deleted successfully',
        variant: 'success',
      });
      
      // Close the dialog
      setIsDeleteTeamDialogOpen(false);
      setTeamToDelete(null);
      
      // Invalidate the teams query to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (name: string) => {
      const client = await createClient();
      const response = await client.post('/teams', { name });
      return response;
    },
    onMutate: async (name) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      
      // Snapshot the previous teams data
      const previousTeams = queryClient.getQueryData(['teams']);
      
      return { previousTeams };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, revert to the previous teams state
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      
      toast({
        title: 'Create Team Failed',
        description: error?.message || 'Failed to create team',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Team created successfully',
        variant: 'success',
      });
      
      // Reset form and close dialog
      setNewTeamName('');
      setIsCreateTeamDialogOpen(false);
      
      // Invalidate the teams query to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Create a map of team IDs to team names
  const teamMap = new Map(teams?.map(team => [team.id, team.name]) || []);

  const handleRoleToggle = (userId: number, currentRole: UserRole, teamId: number | null) => {
    if (currentRole === 'ADMIN') return; // Don't toggle admin roles

    if (currentRole === 'TEAM_MEMBER' || currentRole === 'TECH_LEAD') {
      // Toggle between TEAM_MEMBER and TECH_LEAD
      if (teamId) {
        const newRole = currentRole === 'TEAM_MEMBER' ? 'TECH_LEAD' : 'TEAM_MEMBER';
        updateTeamRole({ teamId, role: newRole });
      }
    } else {
      // Toggle between USER and TEAM_MEMBER
      const newRole = currentRole === 'USER' ? 'TEAM_MEMBER' : 'USER';
      updateUserRole({ userId, role: newRole });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Handler for edit button click
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    // Ensure team ID and role are properly set when opening the dialog
    setEditedTeamId(user.teamId);
    setEditedRole(user.role || 'TEAM_MEMBER'); // Default to TEAM_MEMBER if role is not set
    setIsFormChanged(false);
    setIsEditDialogOpen(true);
  };

  // Handler for delete button click
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Handler for confirming user deletion
  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  // Handlers for form changes
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeamId = e.target.value ? Number(e.target.value) : null;
    setEditedTeamId(newTeamId);
    setIsFormChanged(newTeamId !== editingUser?.teamId);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setEditedRole(newRole);
    setIsFormChanged(newRole !== editingUser?.role);
  };

  // Handler for saving user changes
  const handleSaveChanges = () => {
    if (editingUser && (editedRole !== editingUser.role || editedTeamId !== editingUser.teamId)) {
      // Prepare payload - userId is required, plus either role or teamId
      const payload: { userId: number; role?: UserRole; teamId?: number | null } = {
        userId: editingUser.id
      };
      
      // Only include changed fields
      if (editedRole !== editingUser.role) {
        payload.role = editedRole || undefined;
      }
      
      if (editedTeamId !== editingUser.teamId) {
        payload.teamId = editedTeamId;
      }
      
      // Call update API
      updateUserMutation.mutate(payload);
    }
  };

  // Handler for team edit button click
  const handleEditTeamClick = (team: Team) => {
    setEditingTeam(team);
    setEditedTeamName(team.name);
    setIsTeamFormChanged(false);
    setIsEditTeamDialogOpen(true);
  };

  // Handler for team name change
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setEditedTeamName(newName);
    setIsTeamFormChanged(newName !== editingTeam?.name);
  };

  // Handler for team delete button click
  const handleDeleteTeamClick = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteTeamDialogOpen(true);
  };

  // Handler for confirming team deletion
  const handleConfirmTeamDelete = () => {
    if (teamToDelete) {
      deleteTeamMutation.mutate(teamToDelete.id);
    }
  };

  // Handler for saving team changes
  const handleSaveTeamChanges = () => {
    if (editingTeam && editedTeamName !== editingTeam.name) {
      updateTeamMutation.mutate({
        teamId: editingTeam.id,
        name: editedTeamName
      });
    }
  };

  // Handler for opening create team dialog
  const handleCreateTeamClick = () => {
    setNewTeamName('');
    setIsCreateTeamDialogOpen(true);
  };

  // Handler for new team name change
  const handleNewTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTeamName(e.target.value);
  };

  // Handler for creating new team
  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createTeamMutation.mutate(newTeamName);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Management</h1>
      </div>

      <Tabs defaultValue="user-management" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg w-full max-w-md mx-auto border border-gray-200 shadow-sm">
          <TabsTrigger 
            value="user-management" 
            className="flex-1 py-3 px-4 gap-2 rounded transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Icon icon={HiUsers} className="w-5 h-5" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger 
            value="team-management" 
            className="flex-1 py-3 px-4 gap-2 rounded transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Icon icon={HiUserGroup} className="w-5 h-5" />
            <span>Team Management</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-management" className="mt-6">
        <div className="flex justify-end">
                <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              onChange={handleSearchChange}
              className="pr-4 py-2 w-64"
            />
          </div>
              </div>
          {isLoading || isLoadingTeams ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold">
                            {getUserInitials(user.fullName)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.teamId ? teamMap.get(user.teamId) || 'Unknown Team' : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRoleToggle(user.id, user.role, user.teamId)}
                          disabled={true}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 cursor-not-allowed'
                            : user.role === 'TECH_LEAD'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-not-allowed'
                              : user.role === 'TEAM_MEMBER'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-not-allowed'
                            }`}
                        >
                          {user.role === 'ADMIN' ? 'Admin' : user.role === 'TECH_LEAD' ? 'Tech Lead' : 'Team Member'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleEditClick(user)}
                            disabled={user.role === 'ADMIN'} 
                          >
                            <Icon icon={HiPencilSquare} className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <HiChevronLeft className="h-5 w-5" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next
                      <HiChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="team-management" className="mt-6">
          {isLoadingTeams ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 flex justify-end border-b">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleCreateTeamClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Create Team
                </Button>
              </div>
              {teams && teams.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Team
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold text-lg shadow-sm">
                              {getTeamInitials(team.name)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base font-semibold text-gray-900 text-center">{team.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex justify-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              onClick={() => handleEditTeamClick(team)}
                            >
                              <Icon icon={HiPencilSquare} className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Icon icon={HiUserGroup} className="w-16 h-16 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No Teams Available</h3>
                  <p className="text-gray-500 mt-2 mb-6">Create a team to get started</p>
                  <Button 
                    variant="default"
                    onClick={handleCreateTeamClick}
                  >
                    Create New Team
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Edit User</DialogTitle>
            </DialogHeader>
          </div>
          {editingUser && (
            <div className="p-6">
              <div className="flex justify-center -mt-16 mb-6">
                <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-gray-700 text-3xl font-bold">
                  {getUserInitials(editingUser.fullName)}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-12 items-center gap-4">
                  <label htmlFor="name" className="col-span-3 text-right font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="col-span-9">
                    <Input 
                      id="name" 
                      value={editingUser.fullName} 
                      disabled 
                      className="bg-gray-50 border-gray-300 w-full rounded-md" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-12 items-center gap-4">
                  <label htmlFor="email" className="col-span-3 text-right font-medium text-gray-700">
                    Email
                  </label>
                  <div className="col-span-9">
                    <Input 
                      id="email" 
                      value={editingUser.email} 
                      disabled 
                      className="bg-gray-50 border-gray-300 w-full rounded-md" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-12 items-center gap-4">
                  <label htmlFor="team" className="col-span-3 text-right font-medium text-gray-700">
                    Team
                  </label>
                  <div className="col-span-9">
                    <Select 
                      id="team" 
                      value={editedTeamId?.toString() || ""} 
                      onChange={handleTeamChange}
                      className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md w-full h-10"
                    >
                      {teams?.map((team) => (
                        <option key={team.id} value={team.id.toString()}>
                          {team.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-12 items-center gap-4">
                  <label htmlFor="role" className="col-span-3 text-right font-medium text-gray-700">
                    Role
                  </label>
                  <div className="col-span-9">
                    <Select 
                      id="role" 
                      value={editedRole || ""} 
                      onChange={handleRoleChange}
                      className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md w-full h-10"
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="border-t p-6 flex justify-between gap-4">
            <Button 
              variant="destructive" 
              type="button"
              onClick={() => {
                setIsEditDialogOpen(false);
                setUserToDelete(editingUser);
                setIsDeleteDialogOpen(true);
              }}
              className="px-6 h-10 transition-colors"
              disabled={updateUserMutation.isPending}
            >
              Delete
            </Button>
            <Button 
              type="submit" 
              onClick={handleSaveChanges} 
              disabled={!isFormChanged || !editedTeamId || updateUserMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 transition-colors"
            >
              {updateUserMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Saving...
                </>
              ) : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="bg-red-600 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Confirm Delete</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Do you want to delete this user? This action cannot be undone.</p>
          </div>
          <DialogFooter className="border-t p-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-6 h-10 transition-colors"
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              className="px-6 h-10 transition-colors"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Deleting...
                </>
              ) : 'Yes, delete user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Edit Team</DialogTitle>
            </DialogHeader>
          </div>
          {editingTeam && (
            <div className="p-6">
              <div className="flex justify-center -mt-16 mb-6">
                <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-blue-700 text-3xl font-bold">
                  {getTeamInitials(editingTeam.name)}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-12 items-center gap-4">
                  <label htmlFor="current-name" className="col-span-3 text-right font-medium text-gray-700">
                    Current Name
                  </label>
                  <div className="col-span-9">
                    <Input 
                      id="current-name" 
                      value={editingTeam.name} 
                      disabled 
                      className="bg-gray-50 border-gray-300 w-full rounded-md" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-12 items-center gap-4">
                  <label htmlFor="new-name" className="col-span-3 text-right font-medium text-gray-700">
                    Change Name
                  </label>
                  <div className="col-span-9">
                    <Input 
                      id="new-name" 
                      value={editedTeamName} 
                      onChange={handleTeamNameChange}
                      className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md w-full" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="border-t p-6 flex justify-between gap-4">
            <Button 
              variant="destructive" 
              type="button"
              onClick={() => {
                setIsEditTeamDialogOpen(false);
                setTeamToDelete(editingTeam);
                setIsDeleteTeamDialogOpen(true);
              }}
              className="px-6 h-10 transition-colors"
              disabled={updateTeamMutation.isPending}
            >
              Delete
            </Button>
            <Button 
              type="submit" 
              onClick={handleSaveTeamChanges} 
              disabled={!isTeamFormChanged || updateTeamMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 transition-colors"
            >
              {updateTeamMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Saving...
                </>
              ) : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog open={isDeleteTeamDialogOpen} onOpenChange={setIsDeleteTeamDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="bg-red-600 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Confirm Delete</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Do you want to delete this team? This action cannot be undone.</p>
          </div>
          <DialogFooter className="border-t p-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteTeamDialogOpen(false)}
              className="px-6 h-10 transition-colors"
              disabled={deleteTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmTeamDelete}
              className="px-6 h-10 transition-colors"
              disabled={deleteTeamMutation.isPending}
            >
              {deleteTeamMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Deleting...
                </>
              ) : 'Yes, delete team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Team Dialog */}
      <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Create New Team</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-12 items-center gap-4">
                <label htmlFor="team-name" className="col-span-3 text-right font-medium text-gray-700">
                  Team Name
                </label>
                <div className="col-span-9">
                  <Input 
                    id="team-name" 
                    value={newTeamName} 
                    onChange={handleNewTeamNameChange}
                    placeholder="Enter team name"
                    className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md w-full" 
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t p-6 flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateTeamDialogOpen(false)}
              className="px-6 h-10 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateTeam} 
              disabled={!newTeamName.trim() || createTeamMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 transition-colors"
            >
              {createTeamMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Creating...
                </>
              ) : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 