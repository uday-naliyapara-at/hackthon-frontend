import { forwardRef } from 'react';

import { Select as ShadcnSelect } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <ShadcnSelect
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

Select.displayName = 'Select'; 