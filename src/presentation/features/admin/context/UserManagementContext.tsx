import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { UserManagementService } from '@/application/features/user-management/UserManagementService';
import { UserManagementRepository } from '@/infrastructure/api/user-management/UserManagementRepository';
import { createHttpClient } from '@/infrastructure/utils/http/httpClientFactory';
import { useAuthContext } from '@/presentation/features/auth/context/AuthContext';

interface UserManagementContextType {
  userManagementService: UserManagementService;
}

interface UserManagementProviderProps {
  children: ReactNode;
}

const UserManagementContext = createContext<UserManagementContextType | null>(null);

export const UserManagementProvider = ({ children }: UserManagementProviderProps) => {
  const { sessionService } = useAuthContext();

  const services = useMemo(() => {
    // Create HTTP client with proper token refresh
    const httpClient = createHttpClient(async () => {
      try {
        return await sessionService.refreshAccessToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
      }
    });

    // Create repository
    const userManagementRepository = new UserManagementRepository(httpClient);

    // Create service
    const userManagementService = new UserManagementService(userManagementRepository);

    return {
      userManagementService,
    };
  }, [sessionService]);

  return <UserManagementContext.Provider value={services}>{children}</UserManagementContext.Provider>;
};

export const useUserManagementService = () => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagementService must be used within a UserManagementProvider');
  }
  return context.userManagementService;
}; 