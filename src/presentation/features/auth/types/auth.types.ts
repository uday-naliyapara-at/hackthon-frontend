import type { SocialProvider } from '@/presentation/shared/atoms/SocialIcon';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface AuthFormProps {
  isLoading?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface LoginFormProps extends AuthFormProps {
  onSubmit: (data: LoginFormData) => void;
  onSocialLogin: (provider: SocialProvider) => void;
  signUpUrl?: string;
  forgotPasswordUrl?: string;
}

export interface SignupFormProps extends AuthFormProps {
  onSocialLogin: (provider: SocialProvider) => void;
  onSignupSuccess: (email: string) => void;
  onError?: (error: string) => void;
  loginUrl?: string;
}

export interface ForgotPasswordFormProps extends AuthFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  loginUrl?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
