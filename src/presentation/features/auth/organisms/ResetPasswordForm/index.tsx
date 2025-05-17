import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import { TokenError, ValidationError } from '@/application/features/auth/errors';
import { cn } from '@/lib/utils';
import { useResetPassword } from '@/presentation/features/auth/hooks/useResetPassword';
import { Button } from '@/presentation/shared/atoms/Button';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { Link } from '@/presentation/shared/atoms/Link';
import { useToast } from '@/presentation/shared/atoms/Toast';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
  forgotPasswordUrl?: string;
}

export const ResetPasswordForm = ({
  token,
  forgotPasswordUrl = '/auth/forgot-password',
}: ResetPasswordFormProps) => {
  const { handleResetPassword, isLoading, error, clearError } = useResetPassword();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const getErrorMessage = (error: Error) => {
    if (error instanceof ValidationError) {
      return error.message;
    }
    if (error instanceof TokenError) {
      return 'Invalid or expired reset link. Please request a new one.';
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    await handleResetPassword(token, data.password);
  };

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const toggleConfirmPasswordVisibility = React.useCallback(() => {
    setShowConfirmPassword((prevState) => !prevState);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">Please enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors"
          >
            New Password
          </label>
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
                  disabled={isLoading}
                  {...register('password')}
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

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="w-full">
              <div className="relative">
                <input
                  data-testid="confirm-password-input"
                  className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors pr-10',
                    errors.confirmPassword && 'border-destructive focus-visible:ring-destructive'
                  )}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  aria-invalid={!!errors.confirmPassword}
                  disabled={isLoading}
                  {...register('confirmPassword')}
                />
              </div>
              <div className="min-h-[20px]">
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-[13px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              <Icon
                icon={showConfirmPassword ? HiEyeOff : HiEye}
                className="h-4 w-4"
                data-testid="confirm-password-visibility-toggle"
              />
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>

        <div className="text-center text-sm">
          <Link
            to={forgotPasswordUrl}
            className="text-muted-foreground hover:text-muted-foreground/90 hover:underline"
          >
            Request new reset link
          </Link>
        </div>
      </form>
    </div>
  );
};
