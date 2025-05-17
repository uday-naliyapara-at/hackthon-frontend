import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AccountLockedError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from '../../../../../application/features/auth/errors';
import { createHookWrapper, createMockAuthService } from '../../test/testUtils';
import { useLogin } from '../useLogin';

const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Presentation > Features > Auth > Hooks > useLogin', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    emailVerified: true,
  };

  // Mock credentials
  const validCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  // Mock auth service
  let mockAuthService: ReturnType<typeof createMockAuthService>;

  // Mock options
  const mockOptions = {
    redirectTo: '/custom-dashboard',
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService = createMockAuthService();
    // Reset navigate mock
    vi.mocked(mockNavigate).mockReset();
  });

  it('should handle successful login', async () => {
    vi.mocked(mockAuthService.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(mockAuthService.login).toHaveBeenCalledWith(validCredentials);
    expect(mockOptions.onSuccess).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(mockOptions.redirectTo);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle ValidationError', async () => {
    const error = new ValidationError('Invalid credentials');
    vi.mocked(mockAuthService.login).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(result.current.error).toBe(error);
    expect(mockOptions.onError).toHaveBeenCalledWith(error);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle UnauthorizedError', async () => {
    const error = new UnauthorizedError('Email not verified');
    vi.mocked(mockAuthService.login).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(result.current.error).toBe(error);
    expect(mockOptions.onError).toHaveBeenCalledWith(error);
  });

  it('should handle AccountLockedError', async () => {
    const error = new AccountLockedError('Account locked', 300);
    vi.mocked(mockAuthService.login).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(result.current.error).toBe(error);
    expect(mockOptions.onError).toHaveBeenCalledWith(error);
  });

  it('should handle RateLimitError', async () => {
    const error = new RateLimitError('Too many attempts', 60);
    vi.mocked(mockAuthService.login).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(result.current.error).toBe(error);
    expect(mockOptions.onError).toHaveBeenCalledWith(error);
  });

  it('should handle unexpected errors', async () => {
    const error = new Error('Network error');
    vi.mocked(mockAuthService.login).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(result.current.error).toBe(error);
    expect(mockOptions.onError).toHaveBeenCalledWith(error);
  });

  it('should clear error when clearError is called', async () => {
    const error = new ValidationError('Invalid credentials');
    vi.mocked(mockAuthService.login).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(mockOptions), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(result.current.error).toBe(error);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should use default redirect path when not provided', async () => {
    vi.mocked(mockAuthService.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createHookWrapper(mockAuthService),
    });

    await act(async () => {
      await result.current.login(validCredentials);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
