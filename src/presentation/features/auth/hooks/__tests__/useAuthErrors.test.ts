import { act, renderHook } from '@testing-library/react';

import {
  EmailExistsError,
  NetworkError,
  ValidationError,
} from '@/application/features/auth/errors';

import { useAuthErrors } from '../useAuthErrors';

/**
 * Test suite for useAuthErrors hook
 * Tests error handling and state management for authentication-related errors
 */
describe('useAuthErrors', () => {
  // #region Initial State
  it('should initialize with null error', () => {
    // Arrange & Act
    const { result } = renderHook(() => useAuthErrors());

    // Assert
    expect(result.current.error).toBeNull();
  });
  // #endregion

  // #region Error Handling
  it('should handle EmailExistsError with proper field and message', () => {
    // Arrange
    const { result } = renderHook(() => useAuthErrors());
    const emailError = new EmailExistsError();

    // Act
    act(() => {
      result.current.handleAuthError(emailError);
    });

    // Assert
    console.log(result.current.error);
    expect(result.current.error).toEqual({
      message: 'Email already exists',
      field: 'email',
    });
  });

  it('should handle ValidationError with details', () => {
    // Arrange
    const { result } = renderHook(() => useAuthErrors());
    const validationError = new ValidationError('Validation failed', { field: 'value' });

    // Act
    act(() => {
      result.current.handleAuthError(validationError);
    });

    // Assert
    expect(result.current.error).toEqual({
      message: 'Validation failed',
      details: { field: 'value' },
    });
  });

  it('should handle NetworkError with generic message', () => {
    // Arrange
    const { result } = renderHook(() => useAuthErrors());
    const networkError = new NetworkError('Network failed');

    // Act
    act(() => {
      result.current.handleAuthError(networkError);
    });

    // Assert
    expect(result.current.error).toEqual({
      message: 'Network error occurred. Please try again.',
    });
  });

  it('should handle generic Error with original message', () => {
    // Arrange
    const { result } = renderHook(() => useAuthErrors());
    const genericError = new Error('Something went wrong');

    // Act
    act(() => {
      result.current.handleAuthError(genericError);
    });

    // Assert
    expect(result.current.error).toEqual({
      message: 'Something went wrong',
    });
  });

  it('should handle unknown error with fallback message', () => {
    // Arrange
    const { result } = renderHook(() => useAuthErrors());

    // Act
    act(() => {
      result.current.handleAuthError('unknown error');
    });

    // Assert
    expect(result.current.error).toEqual({
      message: 'An unexpected error occurred',
    });
  });
  // #endregion

  // #region Error Clearing
  it('should clear error state when requested', () => {
    // Arrange
    const { result } = renderHook(() => useAuthErrors());
    const error = new Error('Test error');

    // Act - Set error
    act(() => {
      result.current.handleAuthError(error);
    });
    expect(result.current.error).not.toBeNull();

    // Act - Clear error
    act(() => {
      result.current.clearError();
    });

    // Assert
    expect(result.current.error).toBeNull();
  });
  // #endregion
});
