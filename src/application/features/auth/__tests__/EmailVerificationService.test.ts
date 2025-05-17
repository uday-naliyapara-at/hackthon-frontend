import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IAuthRepository } from '../../../../domain/interfaces/auth';
import { AuthResponse, User } from '../../../../domain/models/user/types';
import { EmailVerificationService } from '../EmailVerificationService';
import { NetworkError, ValidationError } from '../errors';

/**
 * Tests for EmailVerificationService which handles email verification operations
 * including token verification, resending verification emails, and managing cooldown periods.
 */
describe('Application > Features > Auth > EmailVerificationService', () => {
  // Test Data Constants
  const TEST_EMAIL = 'test@example.com';
  const TEST_TOKEN = 'valid-token';
  const COOLDOWN_SECONDS = 60;

  // Test Data Factories
  const createUser = (): User => ({
    id: '123',
    email: TEST_EMAIL,
    firstName: 'John',
    lastName: 'Doe',
    emailVerified: false,
  });

  const createAuthResponse = (): AuthResponse => ({
    user: createUser(),
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
  });

  /**
   * Creates a mock AuthRepository with default behavior
   * @param overrides - Optional partial repository implementation to override defaults
   * @returns Mocked IAuthRepository instance
   */
  const createMockRepository = (overrides: Partial<IAuthRepository> = {}): IAuthRepository => ({
    register: vi.fn().mockResolvedValue(createAuthResponse()),
    login: vi.fn().mockResolvedValue(createAuthResponse()),
    logout: vi.fn().mockResolvedValue(undefined),
    verifyEmail: vi.fn().mockResolvedValue(undefined),
    resendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    refreshToken: vi.fn().mockResolvedValue({ accessToken: 'new-token' }),
    forgotPassword: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    getCurrentUser: vi.fn().mockResolvedValue(createUser()),
    ...overrides,
  });

  /**
   * Creates an EmailVerificationService instance with optional mock repository
   * @param repo - Optional mock repository to use instead of default
   * @returns EmailVerificationService instance
   */
  const createService = (repo?: IAuthRepository): EmailVerificationService => {
    return new EmailVerificationService(repo ?? createMockRepository());
  };

  describe('Service Methods', () => {
    /**
     * Tests for email verification functionality
     */
    describe('verifyEmail', () => {
      it('should successfully verify email with valid token', async () => {
        const service = createService();
        const result = await service.verifyEmail(TEST_TOKEN);
        expect(result).toEqual({
          success: true,
          message: 'Email verified successfully',
          redirectUrl: '/auth/login',
        });
      });

      it('should handle validation errors', async () => {
        const mockRepo = createMockRepository({
          verifyEmail: vi.fn().mockRejectedValue(new ValidationError('Invalid token')),
        });
        const service = createService(mockRepo);
        const result = await service.verifyEmail(TEST_TOKEN);
        expect(result).toEqual({
          success: false,
          message: 'Invalid token',
        });
      });

      it('should throw network errors', async () => {
        const mockRepo = createMockRepository({
          verifyEmail: vi.fn().mockRejectedValue(new NetworkError('Network failed')),
        });
        const service = createService(mockRepo);
        await expect(service.verifyEmail(TEST_TOKEN)).rejects.toThrow(NetworkError);
      });
    });

    /**
     * Tests for verification email resend functionality
     */
    describe('resendVerification', () => {
      it('should successfully resend verification email', async () => {
        const service = createService();
        const result = await service.resendVerification(TEST_EMAIL);
        expect(result).toEqual({
          success: true,
          message: 'Verification email sent successfully',
          cooldownSeconds: COOLDOWN_SECONDS,
        });
      });

      it('should enforce cooldown period', async () => {
        const service = createService();
        await service.resendVerification(TEST_EMAIL);
        const result = await service.resendVerification(TEST_EMAIL);
        expect(result.success).toBe(false);
        expect(result.cooldownSeconds).toBeGreaterThan(0);
      });

      it('should allow resend after cooldown period', async () => {
        const service = createService();
        await service.resendVerification(TEST_EMAIL);
        vi.advanceTimersByTime(COOLDOWN_SECONDS * 1000 + 1000);
        const result = await service.resendVerification(TEST_EMAIL);
        expect(result.success).toBe(true);
      });

      it('should handle validation errors', async () => {
        const mockRepo = createMockRepository({
          resendVerificationEmail: vi.fn().mockRejectedValue(new ValidationError('Invalid email')),
        });
        const service = createService(mockRepo);
        const result = await service.resendVerification(TEST_EMAIL);
        expect(result).toEqual({
          success: false,
          message: 'Invalid email',
          cooldownSeconds: 0,
        });
      });

      it('should throw network errors', async () => {
        const mockRepo = createMockRepository({
          resendVerificationEmail: vi.fn().mockRejectedValue(new NetworkError('Network failed')),
        });
        const service = createService(mockRepo);
        await expect(service.resendVerification(TEST_EMAIL)).rejects.toThrow(NetworkError);
      });
    });

    /**
     * Tests for verification status functionality
     */
    describe('getVerificationStatus', () => {
      it('should return correct status when not in cooldown', () => {
        const service = createService();
        const status = service.getVerificationStatus(TEST_EMAIL);
        expect(status.canResend).toBe(true);
        expect(status.cooldownEndsAt).toBeUndefined();
      });

      it('should return correct status during cooldown', async () => {
        const service = createService();
        await service.resendVerification(TEST_EMAIL);
        const status = service.getVerificationStatus(TEST_EMAIL);
        expect(status.canResend).toBe(false);
        expect(status.cooldownEndsAt).toBeDefined();
        expect(status.cooldownEndsAt!.getTime()).toBeGreaterThan(Date.now());
      });
    });
  });

  /**
   * Tests for repository integration and interaction
   */
  describe('Repository Integration', () => {
    it('should call repository with correct parameters for verification', async () => {
      const mockRepo = createMockRepository();
      const service = createService(mockRepo);
      await service.verifyEmail(TEST_TOKEN);
      expect(mockRepo.verifyEmail).toHaveBeenCalledWith(TEST_TOKEN);
      expect(mockRepo.verifyEmail).toHaveBeenCalledTimes(1);
    });

    it('should call repository with correct parameters for resend', async () => {
      const mockRepo = createMockRepository();
      const service = createService(mockRepo);
      await service.resendVerification(TEST_EMAIL);
      expect(mockRepo.resendVerificationEmail).toHaveBeenCalledWith(TEST_EMAIL);
      expect(mockRepo.resendVerificationEmail).toHaveBeenCalledTimes(1);
    });
  });

  // Setup for time-based tests
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
