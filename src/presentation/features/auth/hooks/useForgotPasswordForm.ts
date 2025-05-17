import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useForm } from 'react-hook-form';

import type { ForgotPasswordFormData } from '../types/auth.types';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const useForgotPasswordForm = (onSubmit: (data: ForgotPasswordFormData) => void) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Handle API errors
      if (error instanceof Error) {
        setError('root', {
          type: 'manual',
          message: error.message,
        });
      }
    }
  });

  return {
    register,
    handleSubmit: handleFormSubmit,
    errors,
    isSubmitting,
    clearErrors,
  };
};
