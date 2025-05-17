import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IAuthRepository } from '../../../../domain/interfaces/auth/IAuthRepository';
import { AuthResponse, Tokens, User } from '../../../../domain/models/user/types';
import { SessionService } from '../SessionService';
import { TokenError } from '../errors';

/**
 * Tests for SessionService which handles token management and session operations.
 * Verifies token storage, refresh flows, and session cleanup.
 */
describe('Application > Features > Auth > SessionService', () => {
  let sessionService: SessionService;
  let mockAuthRepository: IAuthRepository;

  // Test Data Factories
  const createTokens = (overrides: Partial<Tokens> = {}): Tokens => ({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    ...overrides,
  });

  const createUser = (overrides: Partial<User> = {}): User => ({
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    emailVerified: false,
    ...overrides,
  });

  const createAuthResponse = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
    tokens: createTokens(),
    user: createUser(),
    ...overrides,
  });

  /**
   * Creates a mock AuthRepository with default behavior
   * @param overrides - Optional partial repository implementation to override defaults
   */
  const createMockRepository = (overrides: Partial<IAuthRepository> = {}): IAuthRepository => ({
    register: vi.fn().mockResolvedValue(createAuthResponse()),
    login: vi.fn().mockResolvedValue(createAuthResponse()),
    logout: vi.fn().mockResolvedValue(undefined),
    verifyEmail: vi.fn().mockResolvedValue(undefined),
    resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    refreshToken: vi.fn().mockResolvedValue({ accessToken: 'new-access-token' }),
    forgotPassword: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    getCurrentUser: vi.fn().mockResolvedValue(createUser()),
    ...overrides,
  });

  beforeEach(() => {
    mockAuthRepository = createMockRepository();
    sessionService = new SessionService();
    sessionService.initialize(mockAuthRepository);
  });

  describe('Token Management', () => {
    describe('initializeSession', () => {
      it('should successfully store access token', async () => {
        const tokens = createTokens();
        await sessionService.initializeSession(tokens);
        expect(sessionService.getAccessToken()).toBe(tokens.accessToken);
      });

      it('should throw TokenError when tokens are invalid', async () => {
        const invalidTokens = createTokens({ accessToken: '' });
        await expect(sessionService.initializeSession(invalidTokens)).rejects.toThrow(TokenError);
      });
    });

    describe('clearSession', () => {
      it('should successfully clear access token', async () => {
        const tokens = createTokens();
        await sessionService.initializeSession(tokens);
        await sessionService.clearSession();

        expect(sessionService.getAccessToken()).toBeUndefined();
      });

      it('should maintain consistency by clearing token', async () => {
        const tokens = createTokens();
        await sessionService.initializeSession(tokens);
        await sessionService.clearSession();
        expect(sessionService.getAccessToken()).toBeUndefined();
      });
    });

    describe('refreshAccessToken', () => {
      it('should refresh access token successfully', async () => {
        const mockResponse = { accessToken: 'new_access_token' };
        vi.mocked(mockAuthRepository.refreshToken).mockResolvedValueOnce(mockResponse);

        const result = await sessionService.refreshAccessToken();

        expect(result).toBe('new_access_token');
        expect(mockAuthRepository.refreshToken).toHaveBeenCalled();
        expect(localStorage.getItem('accessToken')).toBe('new_access_token');
      });

      it('should throw error when refresh fails', async () => {
        vi.mocked(mockAuthRepository.refreshToken).mockRejectedValueOnce(
          new Error('Refresh failed')
        );

        await expect(sessionService.refreshAccessToken()).rejects.toThrow(
          'Failed to refresh token: Refresh failed'
        );
        expect(localStorage.getItem('accessToken')).toBeNull();
      });
    });

    describe('getRefreshToken', () => {
      it('should maintain security by never exposing refresh token', () => {
        expect(sessionService.getRefreshToken()).toBeUndefined();
      });
    });

    describe('storeTokens', () => {
      it('should successfully store valid tokens', async () => {
        const tokens = createTokens();
        await sessionService.storeTokens(tokens);
        expect(sessionService.getAccessToken()).toBe(tokens.accessToken);
      });

      it('should validate tokens before storage', async () => {
        const invalidTokens = createTokens({ accessToken: '' });
        await expect(sessionService.storeTokens(invalidTokens)).rejects.toThrow(TokenError);
      });

      it('should handle initialization failures gracefully', async () => {
        const invalidTokens = { accessToken: null, refreshToken: null } as unknown as Tokens;
        await expect(sessionService.storeTokens(invalidTokens)).rejects.toThrow();
      });
    });
  });
});
