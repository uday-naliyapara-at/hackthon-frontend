import { forwardRef } from 'react';

import { Input, InputProps } from '@/presentation/shared/atoms/Input';
import { Label } from '@/presentation/shared/atoms/Label';

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  id: string;
  label: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, error, errorMessage, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} error={error} required={required}>
          {label}
        </Label>
        <Input
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

FormField.displayName = 'FormField';
