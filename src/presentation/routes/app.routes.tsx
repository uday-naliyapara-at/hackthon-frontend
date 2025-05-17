import { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/presentation/features/layout/organisms/AppLayout';
import { ProtectedRoute } from '@/presentation/shared/guards/ProtectedRoute';
import { HomePage } from '@/presentation/pages/Home';
import { AnalyticsPage } from '@/presentation/pages/Analytics';

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
        element: <HomePage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
    ],
  },
];
