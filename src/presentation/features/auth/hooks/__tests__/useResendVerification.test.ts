/** @jest-environment jsdom */
import { act, renderHook } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

import { ValidationError } from '@/application/features/auth/errors';

import { createHookWrapper, createMockEmailVerificationService } from '../../test/testUtils';
import { useResendVerification } from '../useResendVerification';

describe('useResendVerification', () => {
  const mockEmailVerificationService = createMockEmailVerificationService();
  const mockResendVerification = mockEmailVerificationService.resendVerification as Mock;
  const mockGetVerificationStatus = mockEmailVerificationService.getVerificationStatus as Mock;
  const wrapper = createHookWrapper(undefined, mockEmailVerificationService);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockGetVerificationStatus.mockReturnValue({ canResend: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // #region Initial State
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useResendVerification(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isResendDisabled).toBe(false);
    expect(result.current.remainingTime).toBe(0);
  });
  // #endregion

  // #region Resend Flow
  it('should handle successful resend', async () => {
    mockResendVerification.mockResolvedValue({
      success: true,
      cooldownSeconds: 60,
    });

    const { result } = renderHook(() => useResendVerification(), { wrapper });

    await act(async () => {
      await result.current.resend('test@example.com');
    });

    expect(mockResendVerification).toHaveBeenCalledWith('test@example.com');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isResendDisabled).toBe(true);
    expect(result.current.remainingTime).toBe(60);
  });

  it('should handle resend error', async () => {
    const error = new ValidationError('Invalid email');
    mockResendVerification.mockRejectedValue(error);

    const { result } = renderHook(() => useResendVerification(), { wrapper });

    await act(async () => {
      await result.current.resend('invalid@example.com');
    });

    expect(mockResendVerification).toHaveBeenCalledWith('invalid@example.com');
    expect(result.current.error).toBe(error.message);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isResendDisabled).toBe(false);
    expect(result.current.remainingTime).toBe(0);
  });

  it('should handle unexpected errors', async () => {
    mockResendVerification.mockRejectedValue(new Error('Unexpected error'));

    const { result } = renderHook(() => useResendVerification(), { wrapper });

    await act(async () => {
      await result.current.resend('test@example.com');
    });

    expect(result.current.error).toBe('Failed to resend verification email. Please try again.');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isResendDisabled).toBe(false);
  });
  // #endregion

  // #region Cooldown
  it('should handle cooldown timer', async () => {
    mockResendVerification.mockResolvedValue({
      success: true,
      cooldownSeconds: 60,
    });

    const { result } = renderHook(() => useResendVerification(), { wrapper });

    await act(async () => {
      await result.current.resend('test@example.com');
    });

    expect(result.current.remainingTime).toBe(60);

    // Fast-forward 30 seconds
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.isResendDisabled).toBe(true);

    // Fast-forward remaining time
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.isResendDisabled).toBe(false);
  });

  it('should prevent resend during cooldown', async () => {
    mockResendVerification.mockResolvedValue({
      success: true,
      cooldownSeconds: 60,
    });

    const { result } = renderHook(() => useResendVerification(), { wrapper });

    await act(async () => {
      await result.current.resend('test@example.com');
    });

    mockResendVerification.mockClear();

    await act(async () => {
      await result.current.resend('test@example.com');
    });

    expect(mockResendVerification).not.toHaveBeenCalled();
  });
  // #endregion
});
