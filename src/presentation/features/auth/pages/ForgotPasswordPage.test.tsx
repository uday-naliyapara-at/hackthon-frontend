import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, expect, it } from 'vitest';

import { createMockAuthService, renderWithProviders } from '../test/testUtils';
import { ForgotPasswordPage } from './ForgotPasswordPage';

describe('pages > ForgotPasswordPage', () => {
  const mockAuthService = createMockAuthService();

  const renderPage = () => {
    return renderWithProviders(<ForgotPasswordPage />, {
      authService: mockAuthService,
    });
  };

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render page elements', () => {
    renderPage();

    // Header elements
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(
      screen.getByText(/enter your email address and we'll send you instructions/i)
    ).toBeInTheDocument();

    // Form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });

  it('should render auth image in desktop view', () => {
    renderPage();
    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('renders forgot password form with card layout', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('should handle successful form submission', async () => {
    const user = userEvent.setup();
    (mockAuthService.forgotPassword as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    renderPage();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset instructions/i }));

    await waitFor(() => {
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/if an account exists with that email/i)).toBeInTheDocument();
    });
  });

  it('renders back to login link', () => {
    renderPage();
    const loginLink = screen.getByText(/back to login/i);
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});
