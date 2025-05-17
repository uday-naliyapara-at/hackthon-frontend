import {  RouteObject } from 'react-router-dom';
import { AppLayout } from '@/presentation/features/layout/organisms/AppLayout';
import { ProtectedRoute } from '@/presentation/shared/guards/ProtectedRoute';




export const appRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute
        element={<AppLayout withPadding />}
        authGuardConfig={{ redirectTo: '/auth/login' }}
      />
    ),
    children: [
      {
        path: '/home',
        element: <div>Home Page</div>,
      },
    ],
  },
];
