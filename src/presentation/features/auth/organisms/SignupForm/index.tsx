import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { Button } from '@/presentation/shared/atoms/Button';
import { Link } from '@/presentation/shared/atoms/Link';
import { FormField } from '@/presentation/shared/molecules/FormField';
import { PasswordField } from '@/presentation/shared/molecules/PasswordField';

import { signupSchema, useAuthErrors, useRegister } from '../../hooks';
import type { SignupFormData, SignupFormProps } from '../../types/auth.types';

export const SignupForm = ({
  onSignupSuccess,
  onError,
  loginUrl = '#',
}: SignupFormProps) => {
  const { register: signUp, isLoading } = useRegister();
  const { error: authError, handleAuthError, clearError } = useAuthErrors();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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

  const onSubmit = async (data: SignupFormData) => {
    try {
      clearError();
      const response = await signUp(data);
      onSignupSuccess(response.user.email);
    } catch (err) {
      const errorData = handleAuthError(err);
      // Show error in toast regardless of type
      if (onError && errorData?.message) {
        onError(errorData.message);
      }
      // Also show field error in form if applicable
      if (errorData?.field) {
        setError(errorData.field as keyof SignupFormData, {
          type: 'manual',
          message: errorData.message,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="firstName"
            label="First Name"
            placeholder="Enter your first name"
            error={!!errors.firstName}
            errorMessage={errors.firstName?.message}
            {...register('firstName')}
          />

          <FormField
            id="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            error={!!errors.lastName}
            errorMessage={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <FormField
          id="email"
          label="Email"
          placeholder="Enter your email"
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <PasswordField
          id="password"
          label="Password"
          error={!!errors.password}
          errorMessage={errors.password?.message}
          showForgotPassword={false}
          {...register('password')}
          placeholder="Enter your password"
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          showForgotPassword={false}
          {...register('confirmPassword')}
          placeholder="Confirm your password"
        />

        {authError && !authError.field && (
          <div className="text-sm text-destructive">{authError.message}</div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          Sign up
        </Button>
      </form>


      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to={loginUrl} className="underline underline-offset-4">
          Login
        </Link>
      </div>

    </div>
  );
};
