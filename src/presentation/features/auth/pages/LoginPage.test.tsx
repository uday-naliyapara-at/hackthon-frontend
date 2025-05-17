import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { renderWithProviders } from '../test/testUtils';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login form with card layout', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Login banner' })).toBeInTheDocument();
  });

  it('logs social login provider', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /continue with google/i }));

    expect(console.log).toHaveBeenCalledWith('Social login with provider:', 'google');
  });

  it('renders auth links with correct URLs', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Sign up')).toHaveAttribute('href', '/auth/signup');
    expect(screen.getByText('Forgot password?')).toHaveAttribute('href', '/auth/forgot-password');
    expect(screen.getByText('Terms of Service')).toHaveAttribute('href', '/legal/terms');
    expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '/legal/privacy');
  });

  it('has responsive layout classes', () => {
    const { container } = renderWithProviders(<LoginPage />);

    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.md\\:p-8')).toBeInTheDocument();
  });
});
