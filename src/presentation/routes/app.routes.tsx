import { RouteObject } from 'react-router-dom';
import { AppLayout } from '@/presentation/features/layout/organisms/AppLayout';
import { ProtectedRoute } from '@/presentation/shared/guards/ProtectedRoute';
import { AdminRoute } from '@/presentation/shared/guards/AdminRoute';
import { HomePage } from '@/presentation/pages/Home';
import { AnalyticsPage } from '@/presentation/pages/Analytics';
import { UserManagementPage } from '@/presentation/pages/Admin/UserManagement';
import { ProfilePage } from '@/presentation/pages/Profile';
import { UserManagementProvider } from '@/presentation/features/admin/context/UserManagementContext';

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
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  // Admin routes
  {
    element: (
      <AdminRoute
        element={<AppLayout withPadding />}
        authGuardConfig={{ redirectTo: '/auth/login' }}
      />
    ),
    children: [
      {
        path: '/admin/users',
        element: (
          <UserManagementProvider>
            <UserManagementPage />
          </UserManagementProvider>
        ),
      },
    ],
  },
];
