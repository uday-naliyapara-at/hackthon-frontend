/**
 * Tests for AuthService which handles authentication business logic.
 * Verifies user registration, token management, and email verification flows.
 * Ensures proper coordination between domain models and infrastructure layer.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IAuthRepository } from '../../../../domain/interfaces/auth/IAuthRepository';
import { ISessionService } from '../../../../domain/interfaces/auth/ISessionService';
import { UserEntity } from '../../../../domain/models/user/User';
import {
  AuthResponse,
  LoginDTO,
  RegisterUserDTO,
  User,
} from '../../../../domain/models/user/types';
import { AuthService } from '../AuthService';
import { EmailExistsError, ForgotPasswordError, TokenError, ValidationError } from '../errors';

// Test data factories
const createRegisterDTO = (overrides: Partial<RegisterUserDTO> = {}): RegisterUserDTO => ({
  email: 'test@example.com',
  password: 'StrongP@ss123',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
});

const createLoginDTO = (overrides: Partial<LoginDTO> = {}): LoginDTO => ({
  email: 'test@example.com',
  password: 'StrongP@ss123',
  ...overrides,
});

const createUser = (overrides: Partial<User> = {}): User => ({
  id: '123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  emailVerified: false,
  ...overrides,
});

const createUserEntity = (overrides: Partial<User> = {}) => {
  const userData = createUser(overrides);
  return UserEntity.create(userData);
};

const createAuthResponse = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
  user: createUser(),
  tokens: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  },
  ...overrides,
});

describe('Application > Features > Auth > AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: {
    register: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    verifyEmail: ReturnType<typeof vi.fn>;
    resendVerificationEmail: ReturnType<typeof vi.fn>;
    refreshToken: ReturnType<typeof vi.fn>;
    forgotPassword: ReturnType<typeof vi.fn>;
    resetPassword: ReturnType<typeof vi.fn>;
    getCurrentUser: ReturnType<typeof vi.fn>;
  };
  let mockSessionService: {
    initializeSession: ReturnType<typeof vi.fn>;
    clearSession: ReturnType<typeof vi.fn>;
    getAccessToken: ReturnType<typeof vi.fn>;
    refreshAccessToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAuthRepository = {
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      verifyEmail: vi.fn(),
      resendVerificationEmail: vi.fn(),
      refreshToken: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    mockSessionService = {
      initializeSession: vi.fn(),
      clearSession: vi.fn(),
      getAccessToken: vi.fn(),
      refreshAccessToken: vi.fn().mockResolvedValue('mock_access_token'),
    };

    authService = new AuthService(
      mockAuthRepository as unknown as IAuthRepository,
      mockSessionService as unknown as ISessionService
    );
  });

  describe('User Registration', () => {
    describe('register', () => {
      const validData = createRegisterDTO();
      const mockResponse = createAuthResponse();

      it('should successfully register a user with valid data', async () => {
        vi.mocked(mockAuthRepository.register).mockResolvedValue(mockResponse);
        vi.mocked(mockSessionService.initializeSession).mockResolvedValue(undefined);

        const response = await authService.register(validData);
        const expectedUser = createUserEntity(mockResponse.user);

        expect(response.tokens).toEqual(mockResponse.tokens);
        expect(response.user).toEqual(expectedUser);
        expect(mockAuthRepository.register).toHaveBeenCalledWith(validData);
        expect(mockSessionService.initializeSession).toHaveBeenCalledWith(mockResponse.tokens);
        expect(authService.getCurrentUser()).toEqual(expectedUser);
      });

      it('should throw EmailExistsError when email is already registered', async () => {
        vi.mocked(mockAuthRepository.register).mockRejectedValue(new EmailExistsError());

        await expect(authService.register(validData)).rejects.toThrow(EmailExistsError);
        expect(mockSessionService.initializeSession).not.toHaveBeenCalled();
      });

      it('should throw ValidationError when password is invalid', async () => {
        const invalidData = createRegisterDTO({ password: 'weak' });
        vi.mocked(mockAuthRepository.register).mockRejectedValue(
          new ValidationError('Password must be at least 8 characters')
        );

        await expect(authService.register(invalidData)).rejects.toThrow(ValidationError);
        expect(mockSessionService.initializeSession).not.toHaveBeenCalled();
      });

      it('should maintain consistent state on registration failure', async () => {
        vi.mocked(mockAuthRepository.register).mockRejectedValue(new Error('Network error'));

        await expect(authService.register(validData)).rejects.toThrow('Network error');
        expect(mockSessionService.initializeSession).not.toHaveBeenCalled();
        expect(authService.getCurrentUser()).toBeNull();
      });
    });
  });

  describe('User Authentication', () => {
    describe('login', () => {
      const validData = createLoginDTO();
      const mockResponse = createAuthResponse();

      it('should successfully authenticate user with valid credentials', async () => {
        vi.mocked(mockAuthRepository.login).mockResolvedValue(mockResponse);
        vi.mocked(mockSessionService.initializeSession).mockResolvedValue(undefined);

        const user = await authService.login(validData);
        const expectedUser = createUserEntity(mockResponse.user);

        expect(user).toEqual(expectedUser);
        expect(mockAuthRepository.login).toHaveBeenCalledWith(validData);
        expect(mockSessionService.initializeSession).toHaveBeenCalledWith(mockResponse.tokens);
        expect(authService.getCurrentUser()).toEqual(expectedUser);
      });

      it('should throw ValidationError for invalid credentials', async () => {
        vi.mocked(mockAuthRepository.login).mockRejectedValue(
          new ValidationError('Invalid credentials')
        );

        await expect(authService.login(validData)).rejects.toThrow(ValidationError);
        expect(mockSessionService.initializeSession).not.toHaveBeenCalled();
      });

      it('should maintain consistent state on login failure', async () => {
        vi.mocked(mockAuthRepository.login).mockRejectedValue(new Error('Network error'));

        await expect(authService.login(validData)).rejects.toThrow('Network error');
        expect(mockSessionService.initializeSession).not.toHaveBeenCalled();
        expect(authService.getCurrentUser()).toBeNull();
      });
    });

    describe('logout', () => {
      it('should successfully clear user session', async () => {
        // Set initial user state
        const mockResponse = createAuthResponse();
        const expectedUser = createUserEntity(mockResponse.user);

        vi.mocked(mockAuthRepository.login).mockResolvedValue(mockResponse);
        vi.mocked(mockSessionService.initializeSession).mockResolvedValue(undefined);
        await authService.login(createLoginDTO());
        expect(authService.getCurrentUser()).toEqual(expectedUser);

        // Test logout
        vi.mocked(mockSessionService.clearSession).mockResolvedValue(undefined);
        vi.mocked(mockAuthRepository.logout).mockResolvedValue(undefined);

        await authService.logout();

        expect(mockAuthRepository.logout).toHaveBeenCalled();
        expect(mockSessionService.clearSession).toHaveBeenCalled();
        expect(authService.getCurrentUser()).toBeNull();
      });
    });
  });

  describe('Password Reset Flow', () => {
    describe('forgotPassword', () => {
      const validEmail = 'test@example.com';

      it('should successfully initiate password reset for valid email', async () => {
        vi.mocked(mockAuthRepository.forgotPassword).mockResolvedValue(undefined);

        await expect(authService.forgotPassword(validEmail)).resolves.not.toThrow();
        expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith(validEmail);
      });

      it('should throw ValidationError for invalid email format', async () => {
        const invalidEmail = 'invalid-email';

        await expect(authService.forgotPassword(invalidEmail)).rejects.toThrow(ValidationError);
        expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled();
      });

      it('should wrap repository errors in ForgotPasswordError', async () => {
        vi.mocked(mockAuthRepository.forgotPassword).mockRejectedValue(new Error('Network error'));

        await expect(authService.forgotPassword(validEmail)).rejects.toThrow(ForgotPasswordError);
        expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith(validEmail);
      });
    });

    describe('resetPassword', () => {
      const validToken = 'valid-reset-token';
      const validPassword = 'NewStrongP@ss123';

      it('should successfully reset password with valid token and password', async () => {
        vi.mocked(mockAuthRepository.resetPassword).mockResolvedValue(undefined);

        await expect(authService.resetPassword(validToken, validPassword)).resolves.not.toThrow();
        expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(validToken, validPassword);
      });

      it('should throw ValidationError for weak password', async () => {
        const weakPassword = 'weak';

        await expect(authService.resetPassword(validToken, weakPassword)).rejects.toThrow(
          ValidationError
        );
        expect(mockAuthRepository.resetPassword).not.toHaveBeenCalled();
      });

      it('should throw TokenError for invalid reset token', async () => {
        vi.mocked(mockAuthRepository.resetPassword).mockRejectedValue(
          new TokenError('Invalid or expired reset token')
        );

        await expect(authService.resetPassword(validToken, validPassword)).rejects.toThrow(
          TokenError
        );
        expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(validToken, validPassword);
      });
    });
  });
});
