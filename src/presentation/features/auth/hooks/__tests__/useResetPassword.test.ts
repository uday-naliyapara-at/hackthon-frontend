/** @jest-environment jsdom */
import { act, renderHook } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

import { TokenError, ValidationError } from '@/application/features/auth/errors';

import { createHookWrapper, createMockAuthService } from '../../test/testUtils';
import { useResetPassword } from '../useResetPassword';

// Mock react-router-dom with proper exports
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock('@/presentation/shared/atoms/Toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock navigate function
const mockNavigate = vi.fn();

describe('hooks > useResetPassword', () => {
  const mockAuthService = createMockAuthService();
  const mockResetPassword = mockAuthService.resetPassword as Mock;
  const validToken = 'valid-token';
  const validPassword = 'NewStrongP@ss123';
  const wrapper = createHookWrapper(mockAuthService);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // #region Initial State
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    expect(result.current).toEqual({
      isLoading: false,
      error: null,
      success: false,
      handleResetPassword: expect.any(Function),
      clearError: expect.any(Function),
    });
  });
  // #endregion

  // #region Success Cases
  it('should handle successful password reset', async () => {
    mockResetPassword.mockResolvedValue(undefined);

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await result.current.handleResetPassword(validToken, validPassword);
    });

    expect(mockResetPassword).toHaveBeenCalledWith(validToken, validPassword);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);

    // Test navigation after success
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
  // #endregion

  // #region Error Cases
  it('should handle validation error', async () => {
    const errorMessage = 'Password is too weak';
    mockResetPassword.mockRejectedValue(new ValidationError(errorMessage));

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await result.current.handleResetPassword(validToken, 'weak');
    });

    expect(mockResetPassword).toHaveBeenCalledWith(validToken, 'weak');
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeInstanceOf(ValidationError);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle token error', async () => {
    const errorMessage = 'Invalid or expired token';
    mockResetPassword.mockRejectedValue(new TokenError(errorMessage));

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await result.current.handleResetPassword('invalid-token', validPassword);
    });

    expect(mockResetPassword).toHaveBeenCalledWith('invalid-token', validPassword);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeInstanceOf(TokenError);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Network error';
    mockResetPassword.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await result.current.handleResetPassword(validToken, validPassword);
    });

    expect(mockResetPassword).toHaveBeenCalledWith(validToken, validPassword);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  // #endregion

  // #region Loading State
  it('should manage loading state during reset', async () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    // Mock a delayed response
    let resolveReset: () => void;
    mockResetPassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveReset = () => resolve(undefined);
        })
    );

    // Start the reset process
    const resetPromise = result.current.handleResetPassword(validToken, validPassword);

    // Loading should be true after starting
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(true);

    // Complete the reset process
    await act(async () => {
      resolveReset();
      await resetPromise;
    });
    expect(result.current.isLoading).toBe(false);
  });
  // #endregion

  // #region Error Management
  it('should clear error when clearError is called', async () => {
    mockResetPassword.mockRejectedValue(new ValidationError('Invalid password'));

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    // First trigger an error
    await act(async () => {
      await result.current.handleResetPassword(validToken, 'weak');
    });

    expect(result.current.error).not.toBeNull();

    // Then clear it
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
  // #endregion

  // #region Stability
  it('should maintain stable function references', () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    const initialHandleResetPassword = result.current.handleResetPassword;
    const initialClearError = result.current.clearError;

    // Trigger a re-render by updating a state
    act(() => {
      result.current.clearError();
    });

    expect(result.current.handleResetPassword).toBe(initialHandleResetPassword);
    expect(result.current.clearError).toBe(initialClearError);
  });
  // #endregion
});
