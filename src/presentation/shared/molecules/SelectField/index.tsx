import { forwardRef } from 'react';

import { Label } from '@/presentation/shared/atoms/Label';
import { Select, SelectProps } from '@/presentation/shared/atoms/Select';

export interface SelectFieldProps extends Omit<SelectProps, 'id'> {
  id: string;
  label: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, error, errorMessage, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} error={error} required={required}>
          {label}
        </Label>
        <Select
          id={id}
          ref={ref}
          error={error}
          helperText={errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          aria-invalid={error}
          required={required}
          className={className}
          {...props}
        />
      </div>
    );
  }
);

SelectField.displayName = 'SelectField'; 