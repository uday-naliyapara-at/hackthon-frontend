import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { IAuthService } from '@/domains/interfaces/auth/IAuthService';
import { IEmailVerificationService } from '@/domains/interfaces/auth/IEmailVerificationService';
import { ISessionService } from '@/domains/interfaces/auth/ISessionService';

import { AuthContext } from '../context/AuthContext';

// Create a test QueryClient with default options
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

export const createMockAuthService = (): IAuthService => ({
  register: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  getCurrentUser: vi.fn(),
});

export const createMockEmailVerificationService = (): IEmailVerificationService => ({
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  getVerificationStatus: vi.fn(),
  canResendVerification: vi.fn(),
});

export const createMockSessionService = (): ISessionService => ({
  initializeSession: vi.fn(),
  clearSession: vi.fn(),
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  refreshAccessToken: vi.fn().mockResolvedValue('mock_access_token'),
  storeTokens: vi.fn(),
  checkAuthStatus: vi.fn(),
  validateSession: vi.fn(),
});

interface TestProvidersProps {
  children: ReactNode;
  authService?: IAuthService;
  emailVerificationService?: IEmailVerificationService;
  sessionService?: ISessionService;
}

export const TestProviders = ({
  children,
  authService = createMockAuthService(),
  emailVerificationService = createMockEmailVerificationService(),
  sessionService = createMockSessionService(),
}: TestProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthContext.Provider value={{ authService, emailVerificationService, sessionService }}>
          {children}
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    authService = createMockAuthService(),
    emailVerificationService = createMockEmailVerificationService(),
    sessionService = createMockSessionService(),
  } = {}
) => {
  return render(
    <TestProviders
      authService={authService}
      emailVerificationService={emailVerificationService}
      sessionService={sessionService}
    >
      {ui}
    </TestProviders>
  );
};

// Hook testing wrapper function that hides JSX implementation
export const createHookWrapper = (
  authService = createMockAuthService(),
  emailVerificationService = createMockEmailVerificationService(),
  sessionService = createMockSessionService()
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders
      authService={authService}
      emailVerificationService={emailVerificationService}
      sessionService={sessionService}
    >
      {children}
    </TestProviders>
  );
  return wrapper;
};
