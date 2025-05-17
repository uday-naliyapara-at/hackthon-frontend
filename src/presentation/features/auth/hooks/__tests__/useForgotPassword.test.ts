import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ForgotPasswordError,
  ValidationError,
} from '../../../../../application/features/auth/errors';
import {
  createHookWrapper,
  createMockAuthService,
  createMockEmailVerificationService,
} from '../../test/testUtils';
import { useForgotPassword } from '../useForgotPassword';

describe('hooks > useForgotPassword', () => {
  const mockAuthService = createMockAuthService();
  const mockEmailVerificationService = createMockEmailVerificationService();
  const validEmail = 'test@example.com';

  beforeEach(() => {
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockReset();
  });

  it('should handle successful password reset request', async () => {
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createHookWrapper(mockAuthService, mockEmailVerificationService),
    });

    await act(async () => {
      await result.current.handleForgotPassword(validEmail);
    });

    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(validEmail);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle validation error', async () => {
    const errorMessage = 'Invalid email format';
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new ValidationError(errorMessage)
    );

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createHookWrapper(mockAuthService, mockEmailVerificationService),
    });

    await act(async () => {
      await result.current.handleForgotPassword('invalid-email');
    });

    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('invalid-email');
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle forgot password error', async () => {
    const errorMessage = 'Too many attempts';
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new ForgotPasswordError(errorMessage)
    );

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createHookWrapper(mockAuthService, mockEmailVerificationService),
    });

    await act(async () => {
      await result.current.handleForgotPassword(validEmail);
    });

    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(validEmail);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle unexpected errors', async () => {
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createHookWrapper(mockAuthService, mockEmailVerificationService),
    });

    await act(async () => {
      await result.current.handleForgotPassword(validEmail);
    });

    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(validEmail);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('An unexpected error occurred. Please try again later.');
    expect(result.current.isLoading).toBe(false);
  });

  it('should reset state when reset is called', async () => {
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new ValidationError('Invalid email')
    );

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createHookWrapper(mockAuthService, mockEmailVerificationService),
    });

    // First trigger an error
    await act(async () => {
      await result.current.handleForgotPassword('invalid-email');
    });

    expect(result.current.error).not.toBeNull();

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
