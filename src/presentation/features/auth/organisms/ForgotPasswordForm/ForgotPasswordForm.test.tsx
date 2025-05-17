import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ForgotPasswordError, ValidationError } from '@/application/features/auth/errors';

import { createMockAuthService, renderWithProviders } from '../../test/testUtils';
import { ForgotPasswordForm } from './';

describe('organisms > ForgotPasswordForm', () => {
  const mockAuthService = createMockAuthService();

  const renderForm = () => {
    return renderWithProviders(<ForgotPasswordForm />, {
      authService: mockAuthService,
    });
  };

  it('should render form elements', () => {
    renderForm();

    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await screen.findByText('Invalid email format');
  });

  it('should handle successful password reset request', async () => {
    const user = userEvent.setup();
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    renderForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await screen.findByText(/if an account exists with that email/i);
  });

  it('should handle validation error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid email format';
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new ValidationError(errorMessage)
    );
    renderForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await screen.findByText(errorMessage);
  });

  it('should handle forgot password error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Too many attempts';
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new ForgotPasswordError(errorMessage)
    );
    renderForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await screen.findByText(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const user = userEvent.setup();
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );
    renderForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await screen.findByText(/an unexpected error occurred/i);
  });

  it('should disable form elements while loading', async () => {
    const user = userEvent.setup();
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    renderForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
