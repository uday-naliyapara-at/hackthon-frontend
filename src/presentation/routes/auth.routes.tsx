import { RouteObject } from 'react-router-dom';

import { ForgotPasswordPage } from '@/presentation/features/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/presentation/features/auth/pages/LoginPage';
import { SignupPage } from '@/presentation/features/auth/pages/SignupPage';
import { VerifyEmailPage } from '@/presentation/features/auth/pages/VerifyEmailPage';
import { PublicRoute } from '@/presentation/shared/guards/PublicRoute';

export const authRoutes: RouteObject[] = [
  {
    element: <PublicRoute redirectTo="/home" />,
    children: [
      {
        path: '/auth/login',
        element: <LoginPage />,
      },
      {
        path: '/auth/signup',
        element: <SignupPage />,
      },
      {
        path: '/auth/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/auth/verify-email',
        element: <VerifyEmailPage />,
      },
    
    ],
  },
];
