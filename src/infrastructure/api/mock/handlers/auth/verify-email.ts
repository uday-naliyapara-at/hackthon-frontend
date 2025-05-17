import { HttpResponse, http } from 'msw';
import { z } from 'zod';

import { authStore } from '../../data/auth.store';
import { SuccessResponse } from '../../types/responses.types';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

// Local schema for verify email request
const VerifyEmailSchema = z.object({
  token: z.string(),
});

export const verifyEmailHandler = http.post<never, SuccessResponse>(
  '/api/auth/verify-email',
  async ({ request }) => {
    try {
      const result = VerifyEmailSchema.safeParse(await request.json());
      if (!result.success) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
          { status: 400 }
        );
      }

      const { token } = result.data;
      console.log('token', token);

      // Get verification token
      const verificationToken = await authStore.getVerificationToken(token);
      console.log('verificationToken', verificationToken);
      if (!verificationToken || verificationToken.type !== 'email') {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
          { status: 400 }
        );
      }

      // Check if token is expired
      if (verificationToken.expiresAt < new Date()) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
          { status: 400 }
        );
      }

      // Get user
      const user = await authStore.getUserById(verificationToken.userId);
      console.log('user', user);
      if (!user) {
        return HttpResponse.json(
          createErrorResponse(AUTH_ERRORS.USER_NOT_FOUND.code, AUTH_ERRORS.USER_NOT_FOUND.message),
          { status: 404 }
        );
      }

      // Update user
      await authStore.updateUser(user.id, { emailVerified: true });

      // Delete verification token
      await authStore.deleteVerificationToken(token);

      return HttpResponse.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse('SERVER_ERROR', 'An unexpected error occurred'),
        { status: 500 }
      );
    }
  }
);
