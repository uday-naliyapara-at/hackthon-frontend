import { HttpResponse, http } from 'msw';
import { z } from 'zod';

import { authStore } from '../../data/auth.store';
import { SuccessResponse } from '../../types/responses.types';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

// Local schema for resend verification request
const ResendVerificationSchema = z.object({
  email: z.string().email(),
});

export const resendVerificationHandler = http.post<never, SuccessResponse>(
  '/api/auth/resend-verification',
  async ({ request }) => {
    try {
      const result = ResendVerificationSchema.safeParse(await request.json());
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

      // Get user
      const user = await authStore.getUserByEmail(email);
      if (!user) {
        // Return success even if user doesn't exist for security
        return HttpResponse.json({
          success: true,
          message:
            'If your email is registered and not verified, you will receive a verification link.',
        });
      }

      // Check if already verified
      if (user.emailVerified) {
        return HttpResponse.json({
          success: true,
          message: 'Email is already verified.',
        });
      }

      // Create mock verification token
      const verificationToken = {
        token: `mock-verification-token-${user.id}`,
        userId: user.id,
        type: 'email' as const,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      await authStore.createVerificationToken(verificationToken);

      return HttpResponse.json({
        success: true,
        message:
          'If your email is registered and not verified, you will receive a verification link.',
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
