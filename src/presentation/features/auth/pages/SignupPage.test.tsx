import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { renderWithProviders } from '../test/testUtils';
import { SignupPage } from './SignupPage';

// Mock functions
const mockRegister = vi.fn();
const mockNavigate = vi.fn();
const mockHandleAuthError = vi.fn();
const mockClearError = vi.fn();

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: () => ({}),
    handleSubmit: (fn: any) => async (e: any) => {
      e.preventDefault();
      await fn({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
      });
    },
    formState: { errors: {} },
    setError: vi.fn(),
  }),
}));

// Mock the hooks
vi.mock('../hooks', () => ({
  useRegister: () => ({
    register: mockRegister,
    isLoading: false,
    error: null,
  }),
  useAuthErrors: () => ({
    error: null,
    handleAuthError: mockHandleAuthError,
    clearError: mockClearError,
  }),
  signupSchema: {
    parse: vi.fn().mockImplementation((data) => data),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  };
});

// Mock zod resolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => (data: unknown) => ({
    values: data,
    errors: {},
  }),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Setup default mock response
    mockRegister.mockResolvedValue({
      user: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        id: '123',
        emailVerified: false,
      },
      tokens: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders signup form with card layout', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Signup banner' })).toBeInTheDocument();
  });

  it('handles form submission and navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Sign up' });
    await user.click(submitButton);

    // Wait for register to be called
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
      });
    });

    // Wait for navigation to login page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('logs social login provider', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await user.click(screen.getByRole('button', { name: /continue with google/i }));

    expect(console.log).toHaveBeenCalledWith('Social signup with provider:', 'google');
  });

  it('renders auth links with correct URLs', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByText('Login')).toHaveAttribute('href', '/auth/login');
    expect(screen.getByText('Terms of Service')).toHaveAttribute('href', '/legal/terms');
    expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '/legal/privacy');
  });

  it('has responsive layout classes', () => {
    const { container } = renderWithProviders(<SignupPage />);

    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.md\\:p-8')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders social login buttons', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });
});
