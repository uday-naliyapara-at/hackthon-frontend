import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { useSearchParams } from 'react-router-dom';

import { useResendVerification } from '../hooks/useResendVerification';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { VerifyEmailPage } from './VerifyEmailPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
  useNavigate: () => mockNavigate,
}));

vi.mock('../hooks/useVerifyEmail', () => ({
  useVerifyEmail: vi.fn().mockReturnValue({
    verify: vi.fn(),
    isVerifying: false,
    isVerified: false,
    error: null,
  }),
}));

vi.mock('../hooks/useResendVerification', () => ({
  useResendVerification: vi.fn().mockReturnValue({
    resend: vi.fn(),
    isResendDisabled: false,
    remainingTime: 0,
    error: null,
  }),
}));

describe('VerifyEmailPage', () => {
  const mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams, mockSetSearchParams]);
  });

  it('should redirect to login when no token and email', () => {
    render(<VerifyEmailPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('should show pending card with email when no token', () => {
    mockSearchParams.set('email', 'test@example.com');
    render(<VerifyEmailPage />);

    expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('should show loading state during verification', () => {
    mockSearchParams.set('token', 'valid-token');
    mockSearchParams.set('email', 'test@example.com');
    (useVerifyEmail as jest.Mock).mockReturnValue({
      verify: vi.fn(),
      isVerifying: true,
      isVerified: false,
      error: null,
    });

    render(<VerifyEmailPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show success message after verification', async () => {
    mockSearchParams.set('token', 'valid-token');
    mockSearchParams.set('email', 'test@example.com');
    const mockVerify = vi.fn();
    (useVerifyEmail as jest.Mock).mockReturnValue({
      verify: mockVerify,
      isVerifying: false,
      isSuccess: true,
      error: null,
    });

    render(<VerifyEmailPage />);
    expect(mockVerify).toHaveBeenCalledWith('valid-token');
    await screen.findByText('Email Verified');
  });

  it('should show error message when verification fails', () => {
    mockSearchParams.set('token', 'invalid-token');
    mockSearchParams.set('email', 'test@example.com');
    (useVerifyEmail as jest.Mock).mockReturnValue({
      verify: vi.fn(),
      isVerifying: false,
      isVerified: false,
      error: 'Invalid verification token',
    });

    render(<VerifyEmailPage />);
    expect(screen.getByText('Invalid verification token')).toBeInTheDocument();
  });

  it('should handle resend verification', async () => {
    mockSearchParams.delete('token');
    mockSearchParams.set('email', 'test@example.com');
    const mockResend = vi.fn();
    (useResendVerification as jest.Mock).mockReturnValue({
      resend: mockResend,
      isResendDisabled: false,
      error: null,
    });

    render(<VerifyEmailPage />);
    await userEvent.click(screen.getByRole('button', { name: /resend email/i }));

    expect(mockResend).toHaveBeenCalledWith('test@example.com');
  });
});
