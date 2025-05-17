import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { useForm } from 'react-hook-form';

import { Button } from '@/presentation/shared/atoms/Button';
import { Link } from '@/presentation/shared/atoms/Link';
import { FormField } from '@/presentation/shared/molecules/FormField';
import { PasswordField } from '@/presentation/shared/molecules/PasswordField';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { signupSchema, useAuthErrors, useRegister } from '../../hooks';
import type { SignupFormData, SignupFormProps } from '../../types/auth.types';

export const SignupForm = ({
  onSignupSuccess,
  onError,
  loginUrl = '#',
}: SignupFormProps) => {
  const { register: signUp, isLoading } = useRegister();
  const { error: authError, handleAuthError, clearError } = useAuthErrors();
  const [selectedTeam, setSelectedTeam] = useState('');

  const teams = [
    { team: 'Engineering', teamId: 1 },
    { team: 'Design', teamId: 2 },
    { team: 'Product', teamId: 3 },
    { team: 'Marketing', teamId: 4 },
    { team: 'Sales', teamId: 5 }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      team: '',
      teamId: 0,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      clearError();
      const response = await signUp(data);
      onSignupSuccess(response.user.email);
    } catch (err) {
      const errorData = handleAuthError(err);
      if (onError && errorData?.message) {
        onError(errorData.message);
      }
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

        <div className="space-y-2 relative">
          <label htmlFor="team" className="block text-sm font-medium">
            Team
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                type="button"
                variant="outline" 
                className="w-full justify-between bg-white border border-input hover:bg-white"
              >
                <span className="text-left truncate">
                  {selectedTeam || 'Select a team'}
                </span>
                <MdKeyboardArrowDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              sideOffset={4}
              className="bg-white z-50"
              style={{ 
                width: '100%',
                minWidth: '335px',
                maxWidth: '100%'
              }}
            >
              {teams.map((teamItem) => (
                <DropdownMenuItem 
                  key={teamItem.teamId}
                  className="py-2.5 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedTeam(teamItem.team);
                    setValue('team', teamItem.team.toLowerCase());
                    setValue('teamId', teamItem.teamId);
                  }}
                >
                  {teamItem.team}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {errors.team && (
            <p className="text-sm text-destructive">{errors.team.message}</p>
          )}
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
