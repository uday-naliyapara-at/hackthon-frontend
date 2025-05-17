import { HttpResponse, http } from 'msw';

import { authStore } from '../../data/auth.store';
import { SuccessResponse } from '../../types/responses.types';
import { extractRefreshTokenFromCookie } from '../../utils/auth';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

export const logoutHandler = http.post<never, SuccessResponse>(
  '/api/auth/logout',
  async ({ request }) => {
    try {
      // Validate access token
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.UNAUTHORIZED.code, AUTH_ERRORS.UNAUTHORIZED.message),
          { status: 401 }
        );
      }

      // Get refresh token from cookie
      const cookieHeader = request.headers.get('cookie');
      const refreshToken = extractRefreshTokenFromCookie(cookieHeader);

      // Clear session if refresh token exists
      if (refreshToken) {
        await authStore.deleteSession(refreshToken);
      }

      // Return response with cleared cookie
      return new HttpResponse(
        JSON.stringify({
          success: true,
          message: 'Logged out successfully',
        }),
        {
          status: 200,
          headers: new Headers({
            'Content-Type': 'application/json',
            // Clear the refresh token cookie
            'Set-Cookie': 'token=; HttpOnly; Path=/; SameSite=Lax; Domain=localhost; Max-Age=0',
          }),
        }
      );
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
