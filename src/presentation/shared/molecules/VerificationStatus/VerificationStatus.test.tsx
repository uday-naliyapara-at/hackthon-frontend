import { render, screen } from '@testing-library/react';

import { VerificationStatus } from '.';

describe('VerificationStatus', () => {
  // #region Rendering Tests
  it('renders pending status correctly', () => {
    render(
      <VerificationStatus
        status="pending"
        title="Verification pending"
        description="Please check your email"
      />
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Verification pending');
    expect(alert).toHaveTextContent('Please check your email');
    expect(alert.querySelector('svg')).toBeInTheDocument();
  });

  it('renders success status correctly', () => {
    render(
      <VerificationStatus status="success" title="Email verified" description="You can now login" />
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Email verified');
    expect(alert).toHaveTextContent('You can now login');
    expect(alert.querySelector('svg')).toBeInTheDocument();
  });

  it('renders error status correctly', () => {
    render(
      <VerificationStatus status="error" title="Verification failed" description="Token expired" />
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Verification failed');
    expect(alert).toHaveTextContent('Token expired');
    expect(alert.querySelector('svg')).toBeInTheDocument();
  });
  // #endregion

  // #region Accessibility Tests
  it('sets correct aria-live attribute based on status', () => {
    const { rerender } = render(<VerificationStatus status="success" title="Success" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    rerender(<VerificationStatus status="error" title="Error" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });
  // #endregion

  // #region Optional Props Tests
  it('renders without description', () => {
    render(<VerificationStatus status="pending" title="Pending" />);
    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Pending');
    expect(alert.querySelector('.description')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<VerificationStatus status="pending" title="Pending" className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
  // #endregion
});
