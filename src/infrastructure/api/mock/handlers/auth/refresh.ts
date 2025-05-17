import { HttpResponse, http } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { authStore } from '../../data/auth.store';
import { TokenResponse } from '../../types/responses.types';
import { extractRefreshTokenFromCookie } from '../../utils/auth';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

export const refreshTokenHandler = http.post<never, TokenResponse>(
  '/api/auth/refresh',
  async ({ request }) => {
    try {
      // Get refresh token from cookie
      const cookieHeader = request.headers.get('cookie');
      console.log('Refresh handler - Cookie header:', cookieHeader);

      const refreshToken = extractRefreshTokenFromCookie(cookieHeader);
      console.log('Refresh handler - Extracted token:', refreshToken);

      if (!refreshToken) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
          { status: 401 }
        );
      }

      // Get session
      const session = await authStore.getSessionByRefreshToken(refreshToken);
      console.log('Found session:', session);

      if (!session) {
        console.log('No session found for refresh token');
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
          { status: 401 }
        );
      }

      // Check if session is expired
      const now = new Date();
      console.log('Current time:', now);
      console.log('Session expires at:', session.expiresAt);

      if (session.expiresAt < now) {
        console.log('Session is expired');
        await authStore.deleteSession(refreshToken);
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
          { status: 401 }
        );
      }

      console.log('Session is valid, generating new tokens');

      // Generate new tokens
      const timestamp = Date.now();
      const newAccessToken = `mock-access-token-${session.userId}-${timestamp}`;
      const newRefreshToken = `mock-refresh-token-${session.userId}-${timestamp}`;

      // Update session with new tokens
      const newSession = {
        id: uuidv4(),
        userId: session.userId,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      // Delete old session and create new one
      await authStore.deleteSession(refreshToken);
      await authStore.createSession(newSession);

      const responseBody = { accessToken: newAccessToken };

      // Return response with cookie
      return new HttpResponse(JSON.stringify(responseBody), {
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${newRefreshToken}; HttpOnly; Path=/; SameSite=Lax; Domain=localhost`,
        }),
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
