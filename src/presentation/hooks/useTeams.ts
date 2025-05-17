import { useQuery } from '@tanstack/react-query';
import { TeamService } from '../../application/features/team/TeamService';
import { Team } from '../../domain/models/team/types';

export const TEAMS_QUERY_KEY = ['teams'] as const;

/**
 * Hook for fetching and managing teams data
 * Uses React Query for data fetching and caching
 */
export const useTeams = (teamService: TeamService) => {
  return useQuery<Team[], Error>({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: () => teamService.getTeams(),
  });
}; 