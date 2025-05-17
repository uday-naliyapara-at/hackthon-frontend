import { HttpResponse, http } from 'msw';
import { z } from 'zod';

import { authStore } from '../../data/auth.store';
import { SuccessResponse } from '../../types/responses.types';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

// Local schema for forgot password request
const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordHandler = http.post<never, SuccessResponse>(
  '/api/auth/forgot-password',
  async ({ request }) => {
    try {
      const result = ForgotPasswordSchema.safeParse(await request.json());
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

      // Check if user exists
      const user = await authStore.getUserByEmail(email);
      if (!user) {
        // Return success even if user doesn't exist for security
        return HttpResponse.json({
          success: true,
          message: 'If your email is registered, you will receive a password reset link.',
        });
      }

      // Create mock reset token
      const resetToken = {
        token: `mock-reset-token-${user.id}`,
        userId: user.id,
        type: 'reset' as const,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      };

      await authStore.createVerificationToken(resetToken);

      return HttpResponse.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link.',
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
