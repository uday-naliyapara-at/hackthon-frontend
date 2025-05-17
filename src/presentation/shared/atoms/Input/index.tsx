import { forwardRef } from 'react';

import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <ShadcnInput
            className={cn(
              'transition-colors',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        <div className="min-h-[20px]">
          {helperText && (
            <p className={cn('mt-1 text-sm', error ? 'text-red-500' : 'text-gray-500')}>
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
