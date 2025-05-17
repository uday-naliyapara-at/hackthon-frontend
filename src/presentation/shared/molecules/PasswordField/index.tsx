import { forwardRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import { cn } from '@/lib/utils';
import { Icon } from '@/presentation/shared/atoms/Icon';
import { Input } from '@/presentation/shared/atoms/Input';
import { Label } from '@/presentation/shared/atoms/Label';
import { Link } from '@/presentation/shared/atoms/Link';
import type { FormFieldProps } from '@/presentation/shared/molecules/FormField';

export interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {
  showToggle?: boolean;
  forgotPasswordUrl?: string;
  showForgotPassword?: boolean;
  errorMessage?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      showToggle = true,
      className,
      error,
      label,
      forgotPasswordUrl = '#',
      showForgotPassword = true,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor={props.id} error={error}>
            {label}
          </Label>
          {showForgotPassword && (
            <Link to={forgotPasswordUrl} className="text-sm hover:underline" variant="muted">
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn('pr-10', className)}
            error={error}
            helperText={errorMessage}
            ref={ref}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[13px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon icon={showPassword ? HiEyeOff : HiEye} className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
