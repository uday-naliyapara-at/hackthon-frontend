import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { appRoutes } from './app.routes';
import { authRoutes } from './auth.routes';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  ...authRoutes,
  ...appRoutes,
];
