import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { MemoryRouter, useNavigate } from 'react-router-dom';

import { VerificationPendingCard } from '.';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('VerificationPendingCard', () => {
  const mockNavigate = vi.fn();
  const defaultProps = {
    email: 'test@example.com',
    onResend: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter });
  };

  // #region Rendering Tests
  it('renders with pending status by default', () => {
    renderWithRouter(<VerificationPendingCard {...defaultProps} />);

    expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    expect(
      screen.getByText(`We sent a verification link to ${defaultProps.email}`)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    const error = 'Something went wrong';
    renderWithRouter(<VerificationPendingCard {...defaultProps} error={error} />);

    expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
  });
  // #endregion

  // #region Interaction Tests
  it('calls onResend when resend button is clicked', async () => {
    renderWithRouter(<VerificationPendingCard {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /resend email/i }));
    expect(defaultProps.onResend).toHaveBeenCalledTimes(1);
  });

  it('disables resend button when isResendDisabled is true', () => {
    renderWithRouter(<VerificationPendingCard {...defaultProps} isResendDisabled />);

    expect(screen.getByRole('button', { name: /resend email/i })).toBeDisabled();
  });

  it('navigates to login page when back to login is clicked', async () => {
    renderWithRouter(<VerificationPendingCard {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: /back to login/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
  // #endregion

  // #region Style Tests
  it('applies custom className', () => {
    renderWithRouter(<VerificationPendingCard {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });
  // #endregion
});
