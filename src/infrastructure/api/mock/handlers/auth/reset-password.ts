import { HttpResponse, http } from 'msw';
import { z } from 'zod';

import { authStore } from '../../data/auth.store';
import { SuccessResponse } from '../../types/responses.types';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

// Local schema for reset password request
const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export const resetPasswordHandler = http.post<never, SuccessResponse>(
  '/api/auth/reset-password',
  async ({ request }) => {
    try {
      const result = ResetPasswordSchema.safeParse(await request.json());
      if (!result.success) {
        return HttpResponse.json(
          createErrorResponse(
            AUTH_ERRORS.INVALID_PASSWORD.code,
            AUTH_ERRORS.INVALID_PASSWORD.message
          ),
          { status: 400 }
        );
      }

      const { token, password } = result.data;

      // Get verification token
      const verificationToken = await authStore.getVerificationToken(token);
      if (!verificationToken || verificationToken.type !== 'reset') {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
          { status: 400 }
        );
      }

      // Check if token is expired
      if (verificationToken.expiresAt < new Date()) {
        await authStore.deleteVerificationToken(token);
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
          { status: 400 }
        );
      }

      // Get user
      const user = await authStore.getUserById(verificationToken.userId);
      if (!user) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.USER_NOT_FOUND.code, AUTH_ERRORS.USER_NOT_FOUND.message),
          { status: 404 }
        );
      }

      // Update password and reset security flags
      await authStore.updateUser(user.id, {
        password: `mock-hashed-${password}`,
        failedLoginAttempts: 0,
        lastFailedLogin: undefined,
        lockoutUntil: undefined,
      });

      // Delete verification token
      await authStore.deleteVerificationToken(token);

      return HttpResponse.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
