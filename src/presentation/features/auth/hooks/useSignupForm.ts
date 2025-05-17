import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useForm } from 'react-hook-form';

import type { SignupFormData } from '../types/auth.types';

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const useSignupForm = (onSubmit: (data: SignupFormData) => void) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
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
    watch,
    clearErrors,
  };
};
