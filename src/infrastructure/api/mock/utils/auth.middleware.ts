import { HttpResponse } from 'msw';

import { authStore } from '../data/auth.store';
import { AUTH_ERRORS } from '../handlers/auth/constants';
import { Session } from '../types/auth.types';
import { extractBearerToken } from './auth';
import { createErrorResponse } from './auth.utils';

export async function validateAuth(
  request: Request
): Promise<{ isValid: boolean; response?: Response }> {
  // Extract token from Authorization header
  const token = extractBearerToken(request.headers.get('Authorization'));
  if (!token) {
    return {
      isValid: false,
      response: HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
        { status: 401 }
      ),
    };
  }

  // Check if token is revoked
  const isRevoked = await authStore.isTokenRevoked(token);
  if (isRevoked) {
    return {
      isValid: false,
      response: HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
        { status: 401 }
      ),
    };
  }

  // Get session by access token
  const sessions = Array.from((await authStore.getAllSessions()).values());
  const session = sessions.find((s: Session) => s.accessToken === token);

  if (!session) {
    return {
      isValid: false,
      response: HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
        { status: 401 }
      ),
    };
  }

  // Check if access token is expired (5 minutes for testing)
  const tokenTimestamp = parseInt(token.split('-').pop() || '0');
  const tokenAge = Date.now() - tokenTimestamp;
  if (tokenAge > 5 * 60 * 1000) {
    // 5 minutes
    return {
      isValid: false,
      response: HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
        { status: 401 }
      ),
    };
  }

  // Get user from session
  const user = await authStore.getUserById(session.userId);
  if (!user) {
    return {
      isValid: false,
      response: HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
        { status: 401 }
      ),
    };
  }

  return { isValid: true };
}
