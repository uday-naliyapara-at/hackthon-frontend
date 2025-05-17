import { HttpResponse, http } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { authStore } from '../../data/auth.store';
import { LoginRequestSchema } from '../../types/auth.types';
import { LoginResponse } from '../../types/responses.types';
import { createErrorResponse } from '../../utils/auth.utils';
import { COMMON_ERRORS } from '../constants';
import { AUTH_ERRORS } from './constants';

export const loginHandler = http.post<never, LoginResponse>(
  '/api/auth/login',
  async ({ request }) => {
    try {
      const result = LoginRequestSchema.safeParse(await request.json());

      // Use INVALID_CREDENTIALS for validation failures to not reveal if the schema is valid
      if (!result.success) {
        return HttpResponse.json(
          createErrorResponse(
            AUTH_ERRORS.INVALID_CREDENTIALS.code,
            AUTH_ERRORS.INVALID_CREDENTIALS.message
          ),
          { status: 400 }
        );
      }

      const { email } = result.data;
      const user = await authStore.getUserByEmail(email);

      // Use INVALID_CREDENTIALS even when user is not found for security (don't reveal if email exists)
      if (!user) {
        return HttpResponse.json(
          createErrorResponse(
            AUTH_ERRORS.INVALID_CREDENTIALS.code,
            AUTH_ERRORS.INVALID_CREDENTIALS.message
          ),
          { status: 400 }
        );
      }

      // Handle test cases based on seeded data
      if (!user.emailVerified) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, 'Email not verified'),
          { status: 403 }
        );
      }

      // Check for pending activation status
      if (user.status === 'Pending') {
        return HttpResponse.json(
          createErrorResponse(
            AUTH_ERRORS.ACCOUNT_PENDING.code,
            AUTH_ERRORS.ACCOUNT_PENDING.message
          ),
          { status: 403 }
        );
      }

      // Check for deactivated status
      if (user.status === 'Deactive') {
        return HttpResponse.json(
          createErrorResponse(
            AUTH_ERRORS.ACCOUNT_DEACTIVATED.code,
            AUTH_ERRORS.ACCOUNT_DEACTIVATED.message
          ),
          { status: 403 }
        );
      }

      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.ACCOUNT_LOCKED.code, AUTH_ERRORS.ACCOUNT_LOCKED.message),
          { status: 403 }
        );
      }

      // Create tokens
      const timestamp = Date.now();
      const tokens = {
        accessToken: `mock-access-token-${user.id}-${timestamp}`,
        refreshToken: `mock-refresh-token-${user.id}-${timestamp}`,
      };

      // Create session
      const session = {
        id: uuidv4(),
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      await authStore.createSession(session);

      const responseBody = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken: tokens.accessToken,
        },
      };

      // Return response with cookie
      return new HttpResponse(JSON.stringify(responseBody), {
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${tokens.refreshToken}; HttpOnly; Path=/; SameSite=Lax; Domain=localhost`,
        }),
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(COMMON_ERRORS.SERVER_ERROR.code, COMMON_ERRORS.SERVER_ERROR.message),
        {
          status: 500,
        }
      );
    }
  }
);
