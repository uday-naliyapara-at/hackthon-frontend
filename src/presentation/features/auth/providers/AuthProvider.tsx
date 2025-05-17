import { ReactNode, createContext, useContext } from 'react';

import { IAuthService } from '../../../../domains/interfaces/auth/IAuthService';

const AuthContext = createContext<IAuthService | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  authService: IAuthService;
}

export const AuthProvider = ({ children, authService }: AuthProviderProps) => {
  return <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>;
};

export const useAuthService = (): IAuthService => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthService must be used within an AuthProvider');
  }
  return context;
};
