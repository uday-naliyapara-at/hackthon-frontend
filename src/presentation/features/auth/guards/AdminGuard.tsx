import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthGuardConfig } from '@/domain/models/auth/types';
import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner';

import { useAuth } from '../hooks/useAuth';

interface AdminGuardProps {
  children: React.ReactNode;
  config?: AuthGuardConfig;
}

export const AdminGuard: FC<AdminGuardProps> = ({
  children,
  config = { redirectTo: '/auth/login' },
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = config.redirectTo || '/auth/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check for admin role
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}; 