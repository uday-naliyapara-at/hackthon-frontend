import { useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

import { Button } from '@/presentation/shared/atoms/Button';
import { Input } from '@/presentation/shared/atoms/Input';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner';
import { useUserManagement } from '@/presentation/features/admin/hooks/useUserManagement';
import { useTeams } from '@/presentation/hooks/useTeams';
import { useTeamContext } from '@/presentation/features/team/context/TeamContext';
import { UserRole } from '@/domain/models/user/types';

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, isLoading, updateUserRole, updateTeamRole } = useUserManagement();
  const { teamService } = useTeamContext();
  const { data: teams, isLoading: isLoadingTeams } = useTeams(teamService);

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4 py-2 w-64"
            />
          </div>
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
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${user.fullName}`}
                          alt={user.fullName}
                        />
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
                      disabled={user.role === 'ADMIN'}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 cursor-not-allowed'
                          : user.role === 'TECH_LEAD'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : user.role === 'TEAM_MEMBER'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 