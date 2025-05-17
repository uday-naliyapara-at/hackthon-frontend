import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthGuardConfig } from '@/domains/models/auth/types';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner';

import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  config?: AuthGuardConfig;
}

export const AuthGuard: FC<AuthGuardProps> = ({
  children,
  config = { redirectTo: '/auth/login' },
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }
  console.log('isAuthenticated', isAuthenticated);

  if (!isAuthenticated) {
    const redirectPath = config.redirectTo || '/auth/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
