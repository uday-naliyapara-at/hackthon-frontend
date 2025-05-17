import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import {
  AccountDeactivatedError,
  AccountLockedError,
  AccountNotApprovedError,
  InvalidCredentialsError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from '@/application/features/auth/errors';
import { cn } from '@/lib/utils';
import { useLogin } from '@/presentation/features/auth/hooks/useLogin';
import { Button } from '@/presentation/shared/atoms/Button';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { Link } from '@/presentation/shared/atoms/Link';
import { useToast } from '@/presentation/shared/atoms/Toast';
import { FormField } from '@/presentation/shared/molecules/FormField';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  signUpUrl?: string;
  forgotPasswordUrl?: string;
  termsUrl?: string;
  privacyUrl?: string;
  redirectTo?: string;
}

export const LoginForm = ({
  signUpUrl = '#',
  redirectTo,
}: LoginFormProps) => {
  const { login, isLoading, error, clearError } = useLogin({
    redirectTo: redirectTo || '/home',
  });
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const getErrorMessage = (error: Error) => {
    if (error instanceof ValidationError) {
      return error.message;
    }
    if (error instanceof UnauthorizedError) {
      return error.message;
    }
    if (error instanceof AccountLockedError) {
      return `Account locked. Please try again in ${error.lockoutDuration} seconds`;
    }
    if (error instanceof AccountNotApprovedError) {
      return error.message;
    }
    if (error instanceof AccountDeactivatedError) {
      return error.message;
    }
    if (error instanceof RateLimitError) {
      return `Too many attempts. Please try again in ${error.retryAfter} seconds`;
    }
    if (error instanceof InvalidCredentialsError) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again';
  };

  // Show error toast when error changes
  React.useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        description: getErrorMessage(error),
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <p className="text-balance text-muted-foreground">Login to your account</p>
      </div>

      <form onSubmit={handleSubmit(login)} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <div className="flex justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors"
            >
              Password
            </label>
            {/* {forgotPasswordUrl && (
              <Link
                to={forgotPasswordUrl}
                className="transition-colors text-muted-foreground hover:text-muted-foreground/90 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            )} */}
          </div>

          <div className="relative">
            <div className="w-full">
              <div className="relative">
                <input
                  data-testid="password-input"
                  className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors pr-10',
                    errors.password && 'border-destructive focus-visible:ring-destructive'
                  )}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  aria-invalid={!!errors.password}
                  {...register('password')}
                  placeholder="Enter your password"
                />
              </div>
              <div className="min-h-[20px]">
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[13px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                icon={showPassword ? HiEyeOff : HiEye}
                className="h-4 w-4"
                data-testid="password-visibility-toggle"
              />
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>


      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link to={signUpUrl} className="underline underline-offset-4">
          Sign up
        </Link>
      </div>


    </div>
  );
};
