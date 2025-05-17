import { z } from 'zod';

import { Email, Name, Password } from '@/domain/models/user/User';

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .refine((value) => new Name(value).isValid(), 'Invalid first name format'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .refine((value) => new Name(value).isValid(), 'Invalid last name format'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .refine((value) => new Email(value).isValid(), 'Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((value) => new Password(value).isValid(), {
        message: 'Password must contain uppercase, lowercase, number, and special character',
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine((value) => new Email(value).isValid(), 'Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => new Password(value).isValid(), {
      message: 'Password must contain uppercase, lowercase, number, and special character',
    }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine((value) => new Email(value).isValid(), 'Invalid email format'),
});

export type SignupSchema = typeof signupSchema;
export type LoginSchema = typeof loginSchema;
export type ForgotPasswordSchema = typeof forgotPasswordSchema;
