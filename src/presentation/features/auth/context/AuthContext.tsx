import { ReactNode, createContext, useContext, useMemo } from 'react';

import { AuthService } from '@/application/features/auth/AuthService';
import { EmailVerificationService } from '@/application/features/auth/EmailVerificationService';
import { SessionService } from '@/application/features/auth/SessionService';
import { IAuthService } from '@/domain/interfaces/auth/IAuthService';
import { IEmailVerificationService } from '@/domain/interfaces/auth/IEmailVerificationService';
import { ISessionService } from '@/domain/interfaces/auth/ISessionService';
import { AuthRepository } from '@/infrastructure/api/auth/AuthRepository';
import { createHttpClient } from '@/infrastructure/utils/http/httpClientFactory';

interface AuthContextType {
  authService: IAuthService;
  emailVerificationService: IEmailVerificationService;
  sessionService: ISessionService;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize services in the correct order with proper dependencies
  const services = useMemo(() => {
    // First create session service (no dependencies)
    const sessionService = new SessionService();

    // Create HTTP client with refresh token function
    const httpClient = createHttpClient(async () => {
      try {
        const response = await sessionService.refreshAccessToken();
        return response;
      } catch (error) {
        await sessionService.clearSession();
        throw error;
      }
    });

    // Create repositories with HTTP client
    const authRepository = new AuthRepository(httpClient);

    // Initialize session service with repository
    sessionService.initialize(authRepository);

    // Create other services
    const authService = new AuthService(authRepository, sessionService);
    const emailVerificationService = new EmailVerificationService(authRepository);

    return {
      authService,
      emailVerificationService,
      sessionService,
    };
  }, []);

  return <AuthContext.Provider value={services}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
