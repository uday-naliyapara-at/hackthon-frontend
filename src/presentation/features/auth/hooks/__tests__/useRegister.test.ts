import { act, renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import type { AuthResponse } from '@/domain/models/user/types';
import type { SignupFormData } from '@/presentation/features/auth/types/auth.types';

import { createHookWrapper, createMockAuthService } from '../../test/testUtils';
import { useRegister } from '../useRegister';

/**
 * Test suite for useRegister hook
 * Tests registration flow including success, loading states, and error handling
 */
describe('Presentation > Features > Auth > Hooks > useRegister', () => {
  // #region Test Setup
  const mockSignupData: SignupFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#',
  };

  const mockAuthResponse: AuthResponse = {
    user: {
      id: '123',
      firstName: mockSignupData.firstName,
      lastName: mockSignupData.lastName,
      email: mockSignupData.email,
      emailVerified: false,
    },
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
  };

  // Mock auth service
  let mockAuthService: ReturnType<typeof createMockAuthService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService = createMockAuthService();
    vi.mocked(mockAuthService.register).mockResolvedValue(mockAuthResponse);
  });
  // #endregion

  // #region Initial State Tests
  describe('Initial State', () => {
    it('should initialize with default state', () => {
      // Arrange & Act
      const { result } = renderHook(() => useRegister(), {
        wrapper: createHookWrapper(mockAuthService),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.register).toBe('function');
    });
  });
  // #endregion

  // #region Registration Flow Tests
  describe('Registration Flow', () => {
    it('should handle successful registration', async () => {
      // Arrange
      const { result } = renderHook(() => useRegister(), {
        wrapper: createHookWrapper(mockAuthService),
      });

      // Act
      let response;
      await act(async () => {
        response = await result.current.register(mockSignupData);
      });

      // Assert
      expect(response).toEqual(mockAuthResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockAuthService.register).toHaveBeenCalledWith({
        firstName: mockSignupData.firstName,
        lastName: mockSignupData.lastName,
        email: mockSignupData.email,
        password: mockSignupData.password,
      });
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
    });

    it('should set loading state during registration', async () => {
      // Arrange
      const { result } = renderHook(() => useRegister(), {
        wrapper: createHookWrapper(mockAuthService),
      });
      let resolvePromise: (value: AuthResponse) => void;
      const delayedPromise = new Promise<AuthResponse>((resolve) => {
        resolvePromise = resolve;
      });
      vi.mocked(mockAuthService.register).mockReturnValue(delayedPromise);

      // Act - Start registration
      let registerPromise: Promise<AuthResponse>;
      await act(async () => {
        registerPromise = result.current.register(mockSignupData);
      });

      // Assert - Check loading state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Act - Complete registration
      await act(async () => {
        resolvePromise!(mockAuthResponse);
        await registerPromise;
      });

      // Assert - Check final state
      expect(result.current.isLoading).toBe(false);
    });
  });
  // #endregion

  // #region Error Handling Tests
  describe('Error Handling', () => {
    it('should handle Error instance', async () => {
      // Arrange
      const mockError = new Error('Registration failed');
      vi.mocked(mockAuthService.register).mockRejectedValue(mockError);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createHookWrapper(mockAuthService),
      });

      // Act & Assert
      await act(async () => {
        await expect(result.current.register(mockSignupData)).rejects.toThrow(mockError);
      });

      // Assert final state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });

    it('should handle non-Error types', async () => {
      // Arrange
      const unknownError = 'Unknown error occurred';
      vi.mocked(mockAuthService.register).mockRejectedValue(unknownError);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createHookWrapper(mockAuthService),
      });

      // Act & Assert
      await act(async () => {
        await expect(result.current.register(mockSignupData)).rejects.toBe(unknownError);
      });

      // Assert final state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Registration failed');
    });

    it('should reset error state on new registration attempt', async () => {
      // Arrange
      const mockError = new Error('First attempt failed');
      vi.mocked(mockAuthService.register)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockAuthResponse);
      const { result } = renderHook(() => useRegister(), {
        wrapper: createHookWrapper(mockAuthService),
      });

      // Act - First attempt (failure)
      await act(async () => {
        await expect(result.current.register(mockSignupData)).rejects.toThrow(mockError);
      });
      expect(result.current.error).toBe(mockError);

      // Act - Second attempt (success)
      await act(async () => {
        await result.current.register(mockSignupData);
      });

      // Assert
      expect(result.current.error).toBeNull();
    });
  });
  // #endregion
});
