/** @jest-environment jsdom */
import { act, renderHook } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

import { createHookWrapper, createMockEmailVerificationService } from '../../test/testUtils';
import { useVerificationStatus } from '../useVerificationStatus';

describe('useVerificationStatus', () => {
  const mockEmailVerificationService = createMockEmailVerificationService();
  const mockGetVerificationStatus = mockEmailVerificationService.getVerificationStatus as Mock;
  const wrapper = createHookWrapper(undefined, mockEmailVerificationService);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockGetVerificationStatus.mockReturnValue({ isVerified: false, canResend: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // #region Initial State
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVerificationStatus(), { wrapper });

    expect(result.current.status).toEqual({
      isVerified: false,
      canResend: true,
    });
    expect(result.current.isLoading).toBe(false);
  });
  // #endregion

  // #region Status Updates
  it('should not update status when email is not provided', () => {
    renderHook(() => useVerificationStatus(), { wrapper });
    expect(mockGetVerificationStatus).not.toHaveBeenCalled();
  });

  it('should update status when email is provided', () => {
    const email = 'test@example.com';
    mockGetVerificationStatus.mockReturnValue({
      isVerified: true,
      canResend: false,
    });

    const { result } = renderHook(() => useVerificationStatus(email), { wrapper });

    expect(mockGetVerificationStatus).toHaveBeenCalledWith(email);
    expect(result.current.status).toEqual({
      isVerified: true,
      canResend: false,
    });
  });
  // #endregion

  // #region Cooldown Updates
  it('should update status periodically during cooldown', async () => {
    const email = 'test@example.com';
    const cooldownEndsAt = new Date(Date.now() + 60000); // 60 seconds from now

    // Initial call returns cooldown
    mockGetVerificationStatus.mockReturnValueOnce({
      isVerified: false,
      canResend: false,
      cooldownEndsAt,
    });

    // Interval check still shows cooldown
    mockGetVerificationStatus.mockReturnValueOnce({
      isVerified: false,
      canResend: false,
      cooldownEndsAt,
    });

    // Update call shows same cooldown
    mockGetVerificationStatus.mockReturnValueOnce({
      isVerified: false,
      canResend: false,
      cooldownEndsAt,
    });

    renderHook(() => useVerificationStatus(email), { wrapper });

    // Initial call
    expect(mockGetVerificationStatus).toHaveBeenCalledTimes(1);

    // Fast forward 1 second and wait for state update
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Called twice: once for interval check, once for update
    expect(mockGetVerificationStatus).toHaveBeenCalledTimes(3);
  });

  it('should stop interval when cooldown ends', async () => {
    const email = 'test@example.com';

    // Initial call
    mockGetVerificationStatus.mockReturnValueOnce({
      isVerified: false,
      canResend: true,
    });

    // Interval check shows no cooldown
    mockGetVerificationStatus.mockReturnValueOnce({
      isVerified: false,
      canResend: true,
    });

    renderHook(() => useVerificationStatus(email), { wrapper });

    // Initial call
    expect(mockGetVerificationStatus).toHaveBeenCalledTimes(1);

    // Fast forward 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Called twice: once for interval check, but no update since no cooldown
    expect(mockGetVerificationStatus).toHaveBeenCalledTimes(2);

    // Fast forward another second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // No more calls since interval was cleared
    expect(mockGetVerificationStatus).toHaveBeenCalledTimes(2);
  });
  // #endregion

  // #region Loading State
  it('should manage loading state', async () => {
    const email = 'test@example.com';
    let isLoadingDuringCall = false;

    mockGetVerificationStatus.mockImplementation(() => {
      isLoadingDuringCall = true;
      return { isVerified: false, canResend: true };
    });

    const { result } = renderHook(() => useVerificationStatus(email), { wrapper });

    // Initial state
    expect(result.current.isLoading).toBe(false);

    // Trigger a status update
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Verify loading state was true during the call
    expect(isLoadingDuringCall).toBe(true);
    // And false after the call completes
    expect(result.current.isLoading).toBe(false);
  });
  // #endregion

  // #region Cleanup
  it('should cleanup interval on unmount', async () => {
    const email = 'test@example.com';
    const cooldownEndsAt = new Date(Date.now() + 60000);
    mockGetVerificationStatus.mockReturnValue({
      isVerified: false,
      canResend: false,
      cooldownEndsAt,
    });

    const { unmount } = renderHook(() => useVerificationStatus(email), { wrapper });

    // Fast forward 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const callCount = mockGetVerificationStatus.mock.calls.length;
    unmount();

    // Fast forward another second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Should not have been called again after unmount
    expect(mockGetVerificationStatus).toHaveBeenCalledTimes(callCount);
  });
  // #endregion
});
