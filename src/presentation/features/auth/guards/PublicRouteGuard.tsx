import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { LoadingSpinner } from '@/presentation/shared/atoms/LoadingSpinner';

import { useAuth } from '../hooks/useAuth';

interface PublicRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRouteGuard: FC<PublicRouteGuardProps> = ({ children, redirectTo = '/home' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to the intended destination or home
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
