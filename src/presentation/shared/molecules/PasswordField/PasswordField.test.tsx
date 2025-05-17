import { fireEvent, render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import { PasswordField } from '.';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: MemoryRouter });
};

describe('PasswordField', () => {
  const defaultProps = {
    id: 'password',
    label: 'Password',
  };

  it('renders with default props', () => {
    renderWithRouter(<PasswordField {...defaultProps} />);

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderWithRouter(<PasswordField {...defaultProps} />);

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('hides toggle button when showToggle is false', () => {
    renderWithRouter(<PasswordField {...defaultProps} showToggle={false} />);

    expect(screen.queryByRole('button', { name: /password/i })).not.toBeInTheDocument();
  });

  it('hides forgot password link when showForgotPassword is false', () => {
    renderWithRouter(<PasswordField {...defaultProps} showForgotPassword={false} />);

    expect(screen.queryByText('Forgot password?')).not.toBeInTheDocument();
  });

  it('uses custom forgot password URL', () => {
    renderWithRouter(<PasswordField {...defaultProps} forgotPasswordUrl="/reset" />);

    const link = screen.getByText('Forgot password?');
    expect(link).toHaveAttribute('href', '/reset');
  });

  it('handles error state', () => {
    renderWithRouter(<PasswordField {...defaultProps} error errorMessage="Invalid password" />);

    expect(screen.getByText('Invalid password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveClass('border-red-500');
  });
});
