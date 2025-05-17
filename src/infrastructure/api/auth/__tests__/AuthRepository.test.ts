/**
 * Tests for AuthRepository which handles authentication-related API calls.
 * Verifies proper HTTP client usage, request/response handling, and error scenarios.
 */
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AccountDeactivatedError,
  AccountLockedError,
  AccountNotApprovedError,
  EmailExistsError,
  ForgotPasswordError,
  InvalidCredentialsError,
  InvalidTokenError,
  NetworkError,
  RateLimitError,
  RegistrationError,
  ResetPasswordError,
  TokenExpiredError,
  UnauthorizedError,
  ValidationError,
} from '../../../../application/features/auth/errors';
import type { LoginDTO, RegisterUserDTO } from '../../../../domain/models/user/types';
import { FetchHttpClient } from '../../../utils/http/FetchHttpClient';
import { AUTH_ERRORS } from '../../mock/handlers/auth/constants';
import { server } from '../../mock/server';
import { createErrorResponse } from '../../mock/utils/auth.utils';
import { AuthRepository } from '../AuthRepository';

describe('Infrastructure > API > Auth > AuthRepository', () => {
  let repository: AuthRepository;
  let httpClient: FetchHttpClient;

  // Test Data Factories
  const createLoginDTO = (overrides: Partial<LoginDTO> = {}): LoginDTO => ({
    email: 'test@example.com',
    password: 'StrongP@ss123',
    ...overrides,
  });

  const createRegisterDTO = (overrides: Partial<RegisterUserDTO> = {}): RegisterUserDTO => ({
    email: 'test@example.com',
    password: 'StrongP@ss123',
    firstName: 'John',
    lastName: 'Doe',
    ...overrides,
  });

  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'error' });
    httpClient = new FetchHttpClient('', async () => 'mock-refresh-token');
    repository = new AuthRepository(httpClient);
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  /**
   * Tests proper HTTP client initialization and method calls
   */
  describe('HTTP Client Integration', () => {
    it('should properly initialize and use HTTP client', async () => {
      const mockHttpClient = {
        post: vi.fn().mockResolvedValue({}),
        get: vi.fn().mockResolvedValue({}),
        put: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
        patch: vi.fn().mockResolvedValue({}),
        postStream: vi.fn().mockResolvedValue({}),
        putStream: vi.fn().mockResolvedValue({}),
      };

      const testRepo = new AuthRepository(mockHttpClient);
      const testData = createRegisterDTO();

      await testRepo.register(testData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/signup', testData);
    });
  });

  /**
   * Tests user registration endpoint functionality
   * Covers successful registration and various error scenarios
   */
  describe('Registration Endpoint', () => {
    const validRegisterData = createRegisterDTO();

    it('should successfully register user with valid data', async () => {
      const result = await repository.register(validRegisterData);
      expect(result).toEqual({
        user: {
          id: expect.any(String),
          email: validRegisterData.email,
          firstName: validRegisterData.firstName,
          lastName: validRegisterData.lastName,
          emailVerified: false,
        },
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });

    it('should handle email exists conflict', async () => {
      server.use(
        http.post('/auth/signup', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.EMAIL_EXISTS.code, AUTH_ERRORS.EMAIL_EXISTS.message),
            { status: 409 }
          );
        })
      );

      await expect(repository.register(validRegisterData)).rejects.toThrow(EmailExistsError);
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post('/auth/signup', () => {
          return HttpResponse.json(
            createErrorResponse(
              'AUTH_002', // INVALID_INPUT
              'Password must be at least 8 characters long'
            ),
            { status: 400 }
          );
        })
      );

      await expect(repository.register(validRegisterData)).rejects.toThrow(RegistrationError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/auth/signup', () => {
          return new Response(null, { status: 500 });
        })
      );

      await expect(repository.register(validRegisterData)).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests login functionality
   * Covers successful login and various error scenarios
   */
  describe('Login Endpoint', () => {
    const loginData = createLoginDTO();

    it('should handle unverified email errors', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, 'Email not verified'),
            { status: 403 }
          );
        })
      );

      await expect(repository.login(loginData)).rejects.toThrow(
        new UnauthorizedError('Email not verified')
      );
    });

    it('should handle account deactivated errors', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            createErrorResponse(
              AUTH_ERRORS.ACCOUNT_DEACTIVATED.code,
              AUTH_ERRORS.ACCOUNT_DEACTIVATED.message
            ),
            { status: 403 }
          );
        })
      );

      await expect(repository.login(loginData)).rejects.toThrow(AccountDeactivatedError);
    });

    it('should handle account locked errors', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            createErrorResponse(
              AUTH_ERRORS.ACCOUNT_LOCKED.code,
              AUTH_ERRORS.ACCOUNT_LOCKED.message
            ),
            { status: 403 }
          );
        })
      );

      await expect(repository.login(loginData)).rejects.toThrow(AccountLockedError);
    });

    it('should handle invalid credentials', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            createErrorResponse(
              AUTH_ERRORS.INVALID_CREDENTIALS.code,
              AUTH_ERRORS.INVALID_CREDENTIALS.message
            ),
            { status: 400 }
          );
        })
      );

      await expect(repository.login(loginData)).rejects.toThrow(InvalidCredentialsError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.login(loginData)).rejects.toThrow(NetworkError);
    });

    it('should handle account not approved error', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            createErrorResponse(
              'AUTH_007', // ACCOUNT_PENDING
              'Your account is awaiting activation by an administrator'
            ),
            { status: 403 }
          );
        })
      );

      await expect(repository.login(loginData)).rejects.toThrow(AccountNotApprovedError);
    });
  });

  /**
   * Tests logout functionality
   * Covers successful logout and error scenarios
   */
  describe('Logout Endpoint', () => {
    const mockAccessToken = 'mock-access-token';

    beforeEach(() => {
      localStorage.setItem('accessToken', mockAccessToken);
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should successfully logout with valid token', async () => {
      server.use(
        http.post('/api/auth/logout', ({ request }) => {
          const authHeader = request.headers.get('Authorization');
          expect(authHeader).toBe(`Bearer ${mockAccessToken}`);
          return HttpResponse.json({ success: true }, { status: 200 });
        })
      );

      await expect(repository.logout()).resolves.not.toThrow();
    });

    it.skip('should handle unauthorized errors', async () => {
      server.use(
        http.post('/api/auth/logout', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
            { status: 401 }
          );
        })
      );

      await expect(repository.logout()).rejects.toThrow(UnauthorizedError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/logout', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.logout()).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests email verification endpoint functionality
   * Covers successful verification and error cases
   */
  describe('Email Verification Endpoint', () => {
    const token = 'verification-token';

    it('should successfully verify email', async () => {
      server.use(
        http.post('/api/auth/verify-email', () => {
          return HttpResponse.json(
            {
              success: true,
              message: 'Email verified successfully',
            },
            { status: 200 }
          );
        })
      );

      await repository.verifyEmail(token);
    });

    it('should handle token validation errors', async () => {
      server.use(
        http.post('/api/auth/verify-email', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
            { status: 400 }
          );
        })
      );

      await expect(repository.verifyEmail(token)).rejects.toThrow(InvalidTokenError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/verify-email', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.verifyEmail(token)).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests verification email resend functionality
   * Covers successful resend and error scenarios
   */
  describe('Verification Email Resend Endpoint', () => {
    const email = 'test@example.com';

    it('should successfully resend verification email', async () => {
      server.use(
        http.post('/api/auth/resend-verification', () => {
          return HttpResponse.json(
            {
              success: true,
              message: 'Verification email sent',
            },
            { status: 200 }
          );
        })
      );

      await repository.resendVerificationEmail(email);
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post('/api/auth/resend-verification', () => {
          return HttpResponse.json(
            createErrorResponse(
              AUTH_ERRORS.INVALID_CREDENTIALS.code,
              AUTH_ERRORS.INVALID_CREDENTIALS.message,
              {
                details: ['Email not found'],
              }
            ),
            { status: 400 }
          );
        })
      );

      await expect(repository.resendVerificationEmail(email)).rejects.toThrow(
        InvalidCredentialsError
      );
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/resend-verification', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.resendVerificationEmail(email)).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests token refresh functionality
   * Covers successful token refresh and error scenarios
   */
  describe('Token Refresh Endpoint', () => {
    const newAccessToken = 'new-access-token';

    it('should successfully refresh token', async () => {
      server.use(
        http.post('/api/auth/refresh', () => {
          return HttpResponse.json({ accessToken: newAccessToken }, { status: 200 });
        })
      );

      const result = await repository.refreshToken();
      expect(result).toEqual({ accessToken: newAccessToken });
    });

    it('should handle unauthorized errors', async () => {
      server.use(
        http.post('/api/auth/refresh', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
            { status: 401 }
          );
        })
      );

      await expect(repository.refreshToken()).rejects.toThrow(NetworkError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/refresh', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.refreshToken()).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests forgot password functionality
   * Covers successful request and error scenarios
   */
  describe('Forgot Password Endpoint', () => {
    const email = 'test@example.com';

    it('should successfully initiate password reset', async () => {
      server.use(
        http.post('/api/auth/forgot-password', () => {
          return HttpResponse.json(
            {
              success: true,
              message: 'If your email is registered, you will receive a password reset link.',
            },
            { status: 200 }
          );
        })
      );

      await expect(repository.forgotPassword(email)).resolves.not.toThrow();
    });

    it('should handle invalid email format', async () => {
      server.use(
        http.post('/api/auth/forgot-password', () => {
          return HttpResponse.json(
            createErrorResponse(
              AUTH_ERRORS.INVALID_CREDENTIALS.code,
              AUTH_ERRORS.INVALID_CREDENTIALS.message
            ),
            { status: 400 }
          );
        })
      );

      await expect(repository.forgotPassword('invalid-email')).rejects.toThrow(ForgotPasswordError);
    });

    it('should handle rate limiting', async () => {
      server.use(
        http.post('/api/auth/forgot-password', () => {
          return HttpResponse.json(
            createErrorResponse(
              'AUTH_014', // AUTH_RATE_LIMIT_EXCEEDED
              'Too many attempts. Try again later'
            ),
            { status: 429 }
          );
        })
      );

      await expect(repository.forgotPassword(email)).rejects.toThrow(RateLimitError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/forgot-password', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.forgotPassword(email)).rejects.toThrow(NetworkError);
    });
  });

  /**
   * Tests password reset functionality
   * Covers successful reset and error scenarios
   */
  describe('Reset Password Endpoint', () => {
    const token = 'valid-reset-token';
    const password = 'NewStrongP@ss123';

    it('should successfully reset password', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => {
          return HttpResponse.json(
            {
              success: true,
              message: 'Password reset successfully',
            },
            { status: 200 }
          );
        })
      );

      await expect(repository.resetPassword(token, password)).resolves.not.toThrow();
    });

    it('should handle invalid token', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.INVALID_TOKEN.code, AUTH_ERRORS.INVALID_TOKEN.message),
            { status: 400 }
          );
        })
      );

      await expect(repository.resetPassword('invalid-token', password)).rejects.toThrow(
        InvalidTokenError
      );
    });

    it('should handle expired token', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => {
          return HttpResponse.json(
            createErrorResponse(AUTH_ERRORS.TOKEN_EXPIRED.code, AUTH_ERRORS.TOKEN_EXPIRED.message),
            { status: 400 }
          );
        })
      );

      await expect(repository.resetPassword(token, password)).rejects.toThrow(TokenExpiredError);
    });

    it('should handle weak password', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => {
          return HttpResponse.json(
            createErrorResponse(
              'AUTH_002', // INVALID_INPUT
              'Password must be at least 8 characters long'
            ),
            { status: 400 }
          );
        })
      );

      await expect(repository.resetPassword(token, 'weak')).rejects.toThrow(ResetPasswordError);
    });

    it('should handle rate limiting', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => {
          return HttpResponse.json(
            createErrorResponse(
              'AUTH_014', // AUTH_RATE_LIMIT_EXCEEDED
              'Too many attempts. Try again later'
            ),
            { status: 429 }
          );
        })
      );

      await expect(repository.resetPassword(token, password)).rejects.toThrow(RateLimitError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/auth/reset-password', () => {
          return HttpResponse.error();
        })
      );

      await expect(repository.resetPassword(token, password)).rejects.toThrow(NetworkError);
    });
  });
});
