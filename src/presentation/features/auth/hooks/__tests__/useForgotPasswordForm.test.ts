import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useForgotPasswordForm } from '../useForgotPasswordForm';

/**
 * Test suite for useForgotPasswordForm hook
 * Tests form validation, submission handling, and error management for the forgot password flow
 */
describe('useForgotPasswordForm', () => {
  // #region Test Setup
  const mockOnSubmit = vi.fn();
  const validEmail = 'test@example.com';
  const invalidEmail = 'invalid-email';

  beforeEach(() => {
    vi.clearAllMocks();
  });
  // #endregion

  // #region Initial State Tests
  it('should initialize with empty form state', () => {
    // Arrange & Act
    const { result } = renderHook(() => useForgotPasswordForm(mockOnSubmit));

    // Assert
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.clearErrors).toBe('function');
  });
  // #endregion

  // #region Form Validation Tests
  it('should validate email format and prevent invalid submission', async () => {
    // Arrange
    const { result } = renderHook(() => useForgotPasswordForm(mockOnSubmit));
    const formEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    // Act
    await act(async () => {
      const emailField = result.current.register('email');
      await emailField.onChange({
        target: { value: invalidEmail, name: 'email' },
      } as React.ChangeEvent<HTMLInputElement>);

      await result.current.handleSubmit(formEvent);
    });

    // Assert
    expect(result.current.errors.email?.message).toBe('Invalid email address');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  // #endregion

  // #region Form Submission Tests
  it('should handle successful form submission with valid email', async () => {
    // Arrange
    const { result } = renderHook(() => useForgotPasswordForm(mockOnSubmit));
    const formEvent = {
      preventDefault: vi.fn(),
      target: {
        email: { value: validEmail },
      },
    } as unknown as React.FormEvent & {
      target: { email: { value: string } };
    };

    // Act
    await act(async () => {
      const emailField = result.current.register('email');
      await emailField.onChange({
        target: { value: validEmail, name: 'email' },
      } as React.ChangeEvent<HTMLInputElement>);

      emailField.onBlur({
        target: { name: 'email', value: validEmail },
      } as React.FocusEvent<HTMLInputElement>);

      await result.current.handleSubmit(formEvent);
    });

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: validEmail,
    });
    expect(result.current.errors).toEqual({});
  });
  // #endregion

  // #region Error Handling Tests
  it('should handle API errors during form submission', async () => {
    // Arrange
    const error = new Error('API Error');
    const mockOnSubmitWithError = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useForgotPasswordForm(mockOnSubmitWithError));
    const formEvent = {
      preventDefault: vi.fn(),
      target: {
        email: { value: validEmail },
      },
    } as unknown as React.FormEvent & {
      target: { email: { value: string } };
    };

    // Act
    await act(async () => {
      const emailField = result.current.register('email');
      await emailField.onChange({
        target: { value: validEmail, name: 'email' },
      } as React.ChangeEvent<HTMLInputElement>);

      emailField.onBlur({
        target: { name: 'email', value: validEmail },
      } as React.FocusEvent<HTMLInputElement>);

      await result.current.handleSubmit(formEvent);
    });

    // Assert
    expect(mockOnSubmitWithError).toHaveBeenCalled();
    expect(result.current.errors.root?.message).toBe('API Error');
  });
  // #endregion

  // #region Error Management Tests
  it('should clear form errors when requested', async () => {
    // Arrange
    const { result } = renderHook(() => useForgotPasswordForm(mockOnSubmit));
    const formEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    // Act - Generate errors
    await act(async () => {
      const emailField = result.current.register('email');
      await emailField.onChange({
        target: { value: invalidEmail, name: 'email' },
      } as React.ChangeEvent<HTMLInputElement>);

      await result.current.handleSubmit(formEvent);
    });

    expect(result.current.errors.email).toBeDefined();

    // Act - Clear errors
    act(() => {
      result.current.clearErrors();
    });

    // Assert
    expect(result.current.errors).toEqual({});
  });
  // #endregion
});
