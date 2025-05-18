import { FC } from 'react';

import { AuthGuardConfig } from '@/domain/models/auth/types';
import { AdminGuard } from '@/presentation/features/auth/guards/AdminGuard';

interface AdminRouteProps {
  element: React.ReactNode;
  authGuardConfig?: AuthGuardConfig;
}

export const AdminRoute: FC<AdminRouteProps> = ({ element, authGuardConfig }) => {
  return <AdminGuard config={authGuardConfig}>{element}</AdminGuard>;
}; 