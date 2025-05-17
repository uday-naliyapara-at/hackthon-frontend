/** @jest-environment jsdom */
import { act, renderHook, waitFor } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

import { NetworkError } from '@/application/features/auth/errors';
import { EmailVerificationResult } from '@/domain/models/auth';

import { createHookWrapper, createMockEmailVerificationService } from '../../test/testUtils';
import { useVerifyEmail } from '../useVerifyEmail';

// Mock react-router-dom with proper exports
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock navigate function
const mockNavigate = vi.fn();

describe('useVerifyEmail', () => {
  const mockEmailVerificationService = createMockEmailVerificationService();
  const mockVerifyEmail = mockEmailVerificationService.verifyEmail as Mock;
  const wrapper = createHookWrapper(undefined, mockEmailVerificationService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // #region Initial State
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    expect(result.current).toEqual({
      isLoading: false,
      isSuccess: false,
      error: null,
      verify: expect.any(Function),
    });
  });
  // #endregion

  // #region Success Cases
  it('should handle successful email verification', async () => {
    const successResult: EmailVerificationResult = {
      success: true,
      message: 'Email verified successfully',
      redirectUrl: '/auth/login',
    };
    mockVerifyEmail.mockResolvedValue(successResult);

    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    await act(async () => {
      await result.current.verify('valid-token');
    });

    expect(mockVerifyEmail).toHaveBeenCalledWith('valid-token');
    expect(result.current).toEqual({
      isLoading: false,
      isSuccess: true,
      error: null,
      verify: expect.any(Function),
    });
  });

  it('should handle successful verification without message', async () => {
    const successResult: EmailVerificationResult = {
      success: true,
      message: 'Email verified successfully',
    };
    mockVerifyEmail.mockResolvedValue(successResult);

    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    await act(async () => {
      await result.current.verify('valid-token');
    });

    expect(mockVerifyEmail).toHaveBeenCalledWith('valid-token');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.isSuccess).toBe(true);
  });
  // #endregion

  // #region Error Cases
  it('should handle validation error', async () => {
    const errorResult: EmailVerificationResult = {
      success: false,
      message: 'Invalid or expired token',
    };
    mockVerifyEmail.mockResolvedValue(errorResult);

    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    await act(async () => {
      await result.current.verify('invalid-token');
    });

    expect(mockVerifyEmail).toHaveBeenCalledWith('invalid-token');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      isLoading: false,
      isSuccess: false,
      error: 'Invalid or expired token',
      verify: expect.any(Function),
    });
  });

  it('should handle network error', async () => {
    const networkError = new NetworkError('Network error occurred');
    mockVerifyEmail.mockRejectedValue(networkError);

    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    await act(async () => {
      await result.current.verify('token');
    });

    expect(mockVerifyEmail).toHaveBeenCalledWith('token');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe(networkError.message);
  });

  it('should handle unexpected error', async () => {
    const unexpectedError = new Error('Unexpected error');
    mockVerifyEmail.mockRejectedValue(unexpectedError);

    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    await act(async () => {
      await result.current.verify('token');
    });

    expect(mockVerifyEmail).toHaveBeenCalledWith('token');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('An unexpected error occurred. Please try again.');
  });
  // #endregion

  // #region Loading State
  it('should manage loading state during verification', async () => {
    let resolveVerification: (value: any) => void;
    const verificationPromise = new Promise((resolve) => {
      resolveVerification = resolve;
    });

    mockVerifyEmail.mockImplementation(async () => {
      await verificationPromise;
      return { success: true, message: 'Success' };
    });

    const { result } = renderHook(() => useVerifyEmail(), { wrapper });

    let verifyPromise: Promise<void>;
    await act(async () => {
      verifyPromise = result.current.verify('token');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      resolveVerification!({ success: true, message: 'Success' });
      await verifyPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
  // #endregion

  // #region Stability
  it('should maintain stable verify function reference', async () => {
    const { result, rerender } = renderHook(() => useVerifyEmail(), { wrapper });

    // Wait for initial render to complete
    await act(async () => {
      await Promise.resolve();
    });

    const initialVerify = result.current.verify;

    rerender();

    expect(result.current.verify).toBe(initialVerify);
  });
  // #endregion
});
