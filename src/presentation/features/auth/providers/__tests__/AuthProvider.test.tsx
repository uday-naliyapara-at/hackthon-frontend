import { render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IAuthService } from '../../../../../domains/interfaces/auth/IAuthService';
import { AuthProvider, useAuthService } from '../AuthProvider';

describe('providers > AuthProvider', () => {
  const mockAuthService = {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    getCurrentUser: vi.fn(),
  } as unknown as IAuthService;

  it('should provide auth service to children', () => {
    const { result } = renderHook(() => useAuthService(), {
      wrapper: ({ children }) => (
        <AuthProvider authService={mockAuthService}>{children}</AuthProvider>
      ),
    });

    expect(result.current).toBe(mockAuthService);
  });

  it('should throw error when useAuthService is used outside provider', () => {
    let error: Error | null = null;
    try {
      renderHook(() => useAuthService());
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).toBe('useAuthService must be used within an AuthProvider');
  });

  it('should render children', () => {
    const TestChild = () => <div data-testid="test-child">Test</div>;

    const { getByTestId } = render(
      <AuthProvider authService={mockAuthService}>
        <TestChild />
      </AuthProvider>
    );

    expect(getByTestId('test-child')).toBeInTheDocument();
  });
});
