import { HttpResponse, http } from 'msw';

import { UnauthorizedError } from '../../../../../application/features/auth/errors';
import { User, UserStatus } from '../../../../../domain/models/user/types';
import { authStore } from '../../data/auth.store';
import { userManagementStore } from '../../data/user-management.store';
import { GetCurrentUserResponse, Session } from '../../types/auth.types';
import { extractBearerToken } from '../../utils/auth';
import { createErrorResponse } from '../../utils/auth.utils';
import { AUTH_ERRORS } from './constants';

export const getCurrentUserHandler = http.get('/api/auth/me', async ({ request }) => {
  try {
    // Extract token from Authorization header
    const token = extractBearerToken(request.headers.get('Authorization'));
    if (!token) {
      return HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
        { status: 401 }
      );
    }

    // Check if token is revoked
    const isRevoked = await authStore.isTokenRevoked(token);
    if (isRevoked) {
      return HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
        { status: 401 }
      );
    }

    // Get session by access token
    const sessions = Array.from((await authStore.getAllSessions()).values());
    const session = sessions.find((s: Session) => s.accessToken === token);

    if (!session) {
      return HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
        { status: 401 }
      );
    }

    // Check if access token is expired (5 minutes for testing)
    const tokenTimestamp = parseInt(token.split('-').pop() || '0');
    const tokenAge = Date.now() - tokenTimestamp;
    console.log('Token age:', tokenAge);
    if (tokenAge > 15 * 1000) {
      // 15 seconds
      console.log('Token expired');
      return HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
        { status: 401 }
      );
    }

    // Get user from session
    const user = await authStore.getUserById(session.userId);
    if (!user) {
      return HttpResponse.json(
        createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
        { status: 401 }
      );
    }

    // Determine user role - admin@efficia.io is admin, all others are regular users
    const role = user.email === 'admin@efficia.io' ? 'admin' : 'user';

    // Try to get extended user data from user management store
    const extendedUser = userManagementStore.getUserByEmail(user.email);

    // Determine status - use from user management store if available, otherwise 'active'
    // Map 'inactive' to 'suspended' to match valid status types
    let status: UserStatus = 'active';
    if (extendedUser) {
      status =
        extendedUser.status === 'inactive' ? 'suspended' : (extendedUser.status as UserStatus);
    }

    // Convert StoredUser to User type
    const responseUser: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      role,
      status,
    };

    const response: GetCurrentUserResponse = {
      user: responseUser,
    };

    return HttpResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return HttpResponse.json({ message: error.message }, { status: 401 });
    }
    return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
