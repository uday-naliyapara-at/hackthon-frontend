import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import { VerificationResultCard } from '.';

// Mock useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

describe('VerificationResultCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // #region Rendering Tests
  it('renders success state correctly', () => {
    render(
      <MemoryRouter>
        <VerificationResultCard isSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText('Email Verified')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your email has been verified successfully. You can now login to your account.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to Login' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const error = 'Token expired';
    render(
      <MemoryRouter>
        <VerificationResultCard isSuccess={false} error={error} onRetry={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to Login' })).toBeInTheDocument();
  });

  it('renders default error message when no error provided', () => {
    render(
      <MemoryRouter>
        <VerificationResultCard isSuccess={false} onRetry={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Failed to verify your email. Please try again.')).toBeInTheDocument();
  });
  // #endregion

  // #region Interaction Tests
  it('calls onRetry when try again button is clicked', async () => {
    const onRetry = vi.fn();
    render(
      <MemoryRouter>
        <VerificationResultCard isSuccess={false} onRetry={onRetry} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('navigates to login page when login button is clicked', async () => {
    render(
      <MemoryRouter>
        <VerificationResultCard isSuccess />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Go to Login' }));
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });
  // #endregion

  // #region Style Tests
  it('applies custom className', () => {
    render(
      <MemoryRouter>
        <VerificationResultCard isSuccess className="custom-class" />
      </MemoryRouter>
    );
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });
  // #endregion
});
