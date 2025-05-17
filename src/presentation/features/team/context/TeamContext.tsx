import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { TeamService } from '@/application/features/team/TeamService';
import { TeamRepository } from '@/infrastructure/api/team/TeamRepository';
import { createHttpClient } from '@/infrastructure/utils/http/httpClientFactory';

interface TeamContextType {
  teamService: TeamService;
}

interface TeamProviderProps {
  children: ReactNode;
}

const TeamContext = createContext<TeamContextType | null>(null);

export const TeamProvider = ({ children }: TeamProviderProps) => {
  const services = useMemo(() => {
    // Create HTTP client
    const httpClient = createHttpClient(async () => ''); // Simple refresh token for now

    // Create repository
    const teamRepository = new TeamRepository(httpClient);

    // Create service
    const teamService = new TeamService(teamRepository);

    return {
      teamService,
    };
  }, []);

  return <TeamContext.Provider value={services}>{children}</TeamContext.Provider>;
};

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
}; 