import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { PublicRouteGuard } from '@/presentation/features/auth/guards/PublicRouteGuard';

interface PublicRouteProps {
  redirectTo?: string;
}

export const PublicRoute: FC<PublicRouteProps> = ({ redirectTo }) => {
  return (
    <PublicRouteGuard redirectTo={redirectTo}>
      <Outlet />
    </PublicRouteGuard>
  );
};
