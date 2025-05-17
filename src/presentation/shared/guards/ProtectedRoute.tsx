import { FC } from 'react';

import { AuthGuardConfig } from '@/domain/models/auth/types';
import { AuthGuard } from '@/presentation/features/auth/guards/AuthGuard';

interface ProtectedRouteProps {
  element: React.ReactNode;
  authGuardConfig?: AuthGuardConfig;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ element, authGuardConfig }) => {
  return <AuthGuard config={authGuardConfig}>{element}</AuthGuard>;
};
