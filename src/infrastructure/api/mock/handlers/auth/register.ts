import { HttpResponse, http } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { authStore } from '../../data/auth.store';
import { RegisterRequestSchema } from '../../types/auth.types';
import { RegisterResponse } from '../../types/responses.types';
import { createErrorResponse } from '../../utils/auth.utils';
import { COMMON_ERRORS } from '../constants';
import { AUTH_ERRORS } from './constants';

export const registerHandler = http.post<never, RegisterResponse>(
  '/api/auth/register',
  async ({ request }) => {
    try {
      const result = RegisterRequestSchema.safeParse(await request.json());
      if (!result.success) {
        return HttpResponse.json(
          createErrorResponse(COMMON_ERRORS.INVALID_INPUT.code, result.error.errors[0].message),
          { status: 400 }
        );
      }

      const { email } = result.data;

      // Check if user already exists
      const existingUser = await authStore.getUserByEmail(email);
      if (existingUser) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.EMAIL_EXISTS.code, AUTH_ERRORS.EMAIL_EXISTS.message),
          { status: 400 }
        );
      }

      // Create new user with mock data
      const newUser = {
        id: uuidv4(),
        ...result.data,
        emailVerified: false,
        failedLoginAttempts: 0,
      };

      await authStore.createUser(newUser);

      // Create mock verification token
      const verificationToken = {
        token: `mock-verification-token-${newUser.id}`,
        userId: newUser.id,
        type: 'email' as const,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
      console.log('verificationToken', 'token=', verificationToken.token);

      await authStore.createVerificationToken(verificationToken);

      // Return response matching the test expectations
      return HttpResponse.json({
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          emailVerified: newUser.emailVerified,
        },
        tokens: {
          accessToken: `mock-access-token-${newUser.id}`,
          refreshToken: `mock-refresh-token-${newUser.id}`,
        },
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
