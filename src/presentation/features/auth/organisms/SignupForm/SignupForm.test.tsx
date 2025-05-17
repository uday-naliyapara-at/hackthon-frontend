import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { z } from 'zod';

import { BrowserRouter } from 'react-router-dom';

import { SignupForm } from '.';
import { useAuthErrors, useRegister } from '../../hooks';

// Mock the hooks
vi.mock('../../hooks', () => ({
  useRegister: vi.fn(),
  useAuthErrors: vi.fn(),
  signupSchema: z
    .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().min(1, 'Email is required').email('Invalid email format'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
}));

// Mock the navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockSignupSuccess = vi.fn();
const mockSocialLogin = vi.fn();

const defaultProps = {
  onSignupSuccess: mockSignupSuccess,
  onSocialLogin: mockSocialLogin,
  loginUrl: '/login',
  termsUrl: '/terms',
  privacyUrl: '/privacy',
};

const renderSignupForm = (props = {}) => {
  return render(
    <BrowserRouter>
      <SignupForm {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default hook mocks
    vi.mocked(useRegister).mockReturnValue({
      register: vi.fn(),
      isLoading: false,
      error: null,
    });
    vi.mocked(useAuthErrors).mockReturnValue({
      error: null,
      handleAuthError: vi.fn(),
      clearError: vi.fn(),
    });
  });

  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render all form elements correctly', () => {
      renderSignupForm();

      // Verify headings
      expect(screen.getByText('Create an account')).toBeInTheDocument();
      expect(screen.getByText('Enter your information to get started')).toBeInTheDocument();

      // Verify form fields
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

      // Verify buttons and links
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('should render with default login URL when not provided', () => {
      renderSignupForm({ loginUrl: undefined });

      const loginLink = screen.getByRole('link', { name: /login/i });
      expect(loginLink).toHaveAttribute('href', '/');
    });
  });
  // #endregion

  // #region Form Validation Tests
  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      renderSignupForm();
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await userEvent.click(submitButton);

      // Wait for validation errors
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/is required/i);
        expect(errorMessages).toHaveLength(4); // firstName, lastName, email, password
      });
    });

    it('should validate email format', async () => {
      renderSignupForm();
      const emailInput = screen.getByLabelText(/email/i);

      await userEvent.type(emailInput, 'invalid-email');
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('should validate password match', async () => {
      renderSignupForm();
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.type(confirmPasswordInput, 'DifferentPassword123!');
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });
  // #endregion

  // #region Form Submission Tests
  describe('Form Submission', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    it('should handle successful form submission', async () => {
      const mockRegister = vi.fn().mockResolvedValue({ user: { email: validFormData.email } });
      vi.mocked(useRegister).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: null,
      });

      renderSignupForm();

      // Fill form
      await userEvent.type(screen.getByLabelText(/first name/i), validFormData.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), validFormData.lastName);
      await userEvent.type(screen.getByLabelText(/email/i), validFormData.email);
      await userEvent.type(screen.getByLabelText(/^password$/i), validFormData.password);
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        validFormData.confirmPassword
      );

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(validFormData);
        expect(mockSignupSuccess).toHaveBeenCalledWith(validFormData.email);
      });
    });

    it('should handle submission error with field validation', async () => {
      const mockError = { field: 'email', message: 'Email already exists' };
      const mockHandleAuthError = vi.fn().mockReturnValue(mockError);
      const mockOnError = vi.fn();
      vi.mocked(useAuthErrors).mockReturnValue({
        error: mockError,
        handleAuthError: mockHandleAuthError,
        clearError: vi.fn(),
      });

      const mockRegister = vi.fn().mockRejectedValue(new Error('Email already exists'));
      vi.mocked(useRegister).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: null,
      });

      renderSignupForm({ onError: mockOnError });

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/first name/i), validFormData.firstName);
      await userEvent.type(screen.getByLabelText(/last name/i), validFormData.lastName);
      await userEvent.type(screen.getByLabelText(/email/i), validFormData.email);
      await userEvent.type(screen.getByLabelText(/^password$/i), validFormData.password);
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        validFormData.confirmPassword
      );

      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        // Verify handleAuthError was called
        expect(mockHandleAuthError).toHaveBeenCalled();
        // Verify field error is shown in the form
        expect(screen.getByText(mockError.message)).toBeInTheDocument();
        // Verify toast error was triggered
        expect(mockOnError).toHaveBeenCalledWith(mockError.message);
      });
    });
  });
  // #endregion

  // #region Loading State Tests
  describe('Loading State', () => {
    it('should disable submit button during form submission', () => {
      vi.mocked(useRegister).mockReturnValue({
        register: vi.fn(),
        isLoading: true,
        error: null,
      });

      renderSignupForm();

      expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
    });
  });
  // #endregion

  // #region Social Login Tests
  describe('Social Login', () => {
    it('should pass social login props correctly', () => {
      const mockSocialLoginHandler = vi.fn();
      renderSignupForm({ onSocialLogin: mockSocialLoginHandler });

      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });
  });
  // #endregion
});
