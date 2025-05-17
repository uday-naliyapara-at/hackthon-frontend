import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useSignupForm } from '../useSignupForm';

/**
 * Test suite for useSignupForm hook
 * Tests form validation, submission handling, and field watching for the signup form
 */
describe('useSignupForm', () => {
  // #region Test Setup
  const mockOnSubmit = vi.fn();
  const validFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  // #endregion

  // #region Initial State Tests
  it('should initialize with empty form state and required functions', () => {
    // Arrange & Act
    const { result } = renderHook(() => useSignupForm(mockOnSubmit));

    // Assert
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.watch).toBe('function');
    expect(typeof result.current.clearErrors).toBe('function');
  });
  // #endregion

  // #region Form Validation Tests
  describe('form validation', () => {
    it('should enforce required fields validation', async () => {
      // Arrange
      const { result } = renderHook(() => useSignupForm(mockOnSubmit));
      const formEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;

      // Act
      await act(async () => {
        await result.current.handleSubmit(formEvent);
      });

      // Assert
      expect(result.current.errors.firstName?.message).toBe('First name is required');
      expect(result.current.errors.lastName?.message).toBe('Last name is required');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate email format and prevent invalid submission', async () => {
      // Arrange
      const { result } = renderHook(() => useSignupForm(mockOnSubmit));
      const formEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;

      // Act
      await act(async () => {
        const fields = {
          firstName: result.current.register('firstName'),
          lastName: result.current.register('lastName'),
          email: result.current.register('email'),
        };

        await fields.firstName.onChange({
          target: { value: 'John', name: 'firstName' },
        } as React.ChangeEvent<HTMLInputElement>);

        await fields.lastName.onChange({
          target: { value: 'Doe', name: 'lastName' },
        } as React.ChangeEvent<HTMLInputElement>);

        await fields.email.onChange({
          target: { value: 'invalid-email', name: 'email' },
        } as React.ChangeEvent<HTMLInputElement>);

        await result.current.handleSubmit(formEvent);
      });

      // Assert
      expect(result.current.errors.email?.message).toBe('Invalid email address');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate password requirements for various scenarios', async () => {
      // Arrange
      const { result } = renderHook(() => useSignupForm(mockOnSubmit));
      const testCases = [
        { password: 'short', error: 'Password must be at least 8 characters' },
        {
          password: 'longpassword123!',
          error: 'Password must contain at least one uppercase letter',
        },
        { password: 'LONGPASSWORD!@#', error: 'Password must contain at least one number' },
        {
          password: 'LongPassword123',
          error: 'Password must contain at least one special character',
        },
      ];

      // Act & Assert
      for (const testCase of testCases) {
        await act(async () => {
          const formEvent = {
            preventDefault: vi.fn(),
          } as unknown as React.FormEvent;

          const fields = {
            firstName: result.current.register('firstName'),
            lastName: result.current.register('lastName'),
            email: result.current.register('email'),
            password: result.current.register('password'),
            confirmPassword: result.current.register('confirmPassword'),
          };

          // Fill required fields
          await fields.firstName.onChange({
            target: { value: 'John', name: 'firstName' },
          } as React.ChangeEvent<HTMLInputElement>);

          await fields.lastName.onChange({
            target: { value: 'Doe', name: 'lastName' },
          } as React.ChangeEvent<HTMLInputElement>);

          await fields.email.onChange({
            target: { value: 'john@example.com', name: 'email' },
          } as React.ChangeEvent<HTMLInputElement>);

          await fields.password.onChange({
            target: { value: testCase.password, name: 'password' },
          } as React.ChangeEvent<HTMLInputElement>);

          await fields.confirmPassword.onChange({
            target: { value: testCase.password, name: 'confirmPassword' },
          } as React.ChangeEvent<HTMLInputElement>);

          await result.current.handleSubmit(formEvent);
        });

        expect(result.current.errors.password?.message).toBe(testCase.error);
      }
    });

    it('should validate password confirmation matches', async () => {
      // Arrange
      const { result } = renderHook(() => useSignupForm(mockOnSubmit));
      const formEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;

      // Act
      await act(async () => {
        const fields = {
          firstName: result.current.register('firstName'),
          lastName: result.current.register('lastName'),
          email: result.current.register('email'),
          password: result.current.register('password'),
          confirmPassword: result.current.register('confirmPassword'),
        };

        await fields.firstName.onChange({
          target: { value: 'John', name: 'firstName' },
        } as React.ChangeEvent<HTMLInputElement>);

        await fields.lastName.onChange({
          target: { value: 'Doe', name: 'lastName' },
        } as React.ChangeEvent<HTMLInputElement>);

        await fields.email.onChange({
          target: { value: 'john@example.com', name: 'email' },
        } as React.ChangeEvent<HTMLInputElement>);

        await fields.password.onChange({
          target: { value: 'Test123!@#', name: 'password' },
        } as React.ChangeEvent<HTMLInputElement>);

        await fields.confirmPassword.onChange({
          target: { value: 'DifferentPass123!@#', name: 'confirmPassword' },
        } as React.ChangeEvent<HTMLInputElement>);

        await result.current.handleSubmit(formEvent);
      });

      // Assert
      expect(result.current.errors.confirmPassword?.message).toBe("Passwords don't match");
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
  // #endregion

  // #region Form Submission Tests
  it('should handle successful form submission with valid data', async () => {
    // Arrange
    const { result } = renderHook(() => useSignupForm(mockOnSubmit));
    const formEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    // Act
    await act(async () => {
      // Fill in all fields
      for (const [field, value] of Object.entries(validFormData)) {
        const formField = result.current.register(field as keyof typeof validFormData);
        await formField.onChange({
          target: { value, name: field },
        } as React.ChangeEvent<HTMLInputElement>);
      }

      await result.current.handleSubmit(formEvent);
    });

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(validFormData);
    expect(result.current.errors).toEqual({});
  });
  // #endregion

  // #region Error Handling Tests
  it('should handle API errors during form submission', async () => {
    // Arrange
    const error = new Error('API Error');
    const mockOnSubmitWithError = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useSignupForm(mockOnSubmitWithError));
    const formEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    // Act
    await act(async () => {
      // Fill in all fields
      for (const [field, value] of Object.entries(validFormData)) {
        const formField = result.current.register(field as keyof typeof validFormData);
        await formField.onChange({
          target: { value, name: field },
        } as React.ChangeEvent<HTMLInputElement>);
      }

      await result.current.handleSubmit(formEvent);
    });

    // Assert
    expect(mockOnSubmitWithError).toHaveBeenCalled();
    expect(result.current.errors.root?.message).toBe('API Error');
  });
  // #endregion

  // #region Form Field Watching Tests
  it('should watch and track form field values', async () => {
    // Arrange
    const { result } = renderHook(() => useSignupForm(mockOnSubmit));
    const formEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    // Act
    await act(async () => {
      const passwordField = result.current.register('password');
      await passwordField.onChange({
        target: { value: 'Test123!@#', name: 'password' },
      } as React.ChangeEvent<HTMLInputElement>);

      await result.current.handleSubmit(formEvent);
    });

    // Assert
    expect(result.current.watch('password')).toBe('Test123!@#');
  });
  // #endregion
});
