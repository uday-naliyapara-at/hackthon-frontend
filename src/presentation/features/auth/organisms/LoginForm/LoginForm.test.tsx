import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  AccountLockedError,
  AccountNotApprovedError,
  RateLimitError,
  UnauthorizedError,
} from '@/application/features/auth/errors';
import type { IAuthService } from '@/domains/interfaces/auth/IAuthService';
import { Toaster } from '@/presentation/shared/atoms/Toast';

import { LoginForm } from '.';
import { renderWithProviders } from '../../test/testUtils';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Presentation > Features > Auth > LoginForm', () => {
  const mockAuthService = {
    login: vi.fn().mockResolvedValue({}),
  } as unknown as IAuthService & { login: ReturnType<typeof vi.fn> };

  const mockSocialLogin = vi.fn();

  const renderLoginForm = (props = {}) => {
    return renderWithProviders(
      <>
        <LoginForm onSocialLogin={mockSocialLogin} {...props} />
        <Toaster />
      </>,
      { authService: mockAuthService }
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    mockAuthService.login.mockResolvedValueOnce({});
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should show validation error', async () => {
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle unauthorized error', async () => {
    mockAuthService.login.mockRejectedValueOnce(new UnauthorizedError('Invalid email or password'));
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should handle account locked error', async () => {
    mockAuthService.login.mockRejectedValueOnce(new AccountLockedError('Account is locked', 300));
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/account locked. please try again in 300 seconds/i)
      ).toBeInTheDocument();
    });
  });

  it('should handle rate limit error', async () => {
    mockAuthService.login.mockRejectedValueOnce(new RateLimitError('Too many attempts', 60));
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/too many attempts/i)).toBeInTheDocument();
    });
  });

  it('should handle custom redirect path', async () => {
    mockAuthService.login.mockResolvedValueOnce({});
    renderLoginForm({ redirectTo: '/custom-path' });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/custom-path');
    });
  });

  it('should handle account not approved error', async () => {
    mockAuthService.login.mockRejectedValueOnce(
      new AccountNotApprovedError('Your account is pending approval by an administrator')
    );
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Your account is pending approval by an administrator/i)
      ).toBeInTheDocument();
    });
  });
});
