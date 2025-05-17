import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useForm } from 'react-hook-form';

import { Button } from '@/presentation/shared/atoms/Button';
import { Link } from '@/presentation/shared/atoms/Link';
import { FormField } from '@/presentation/shared/molecules/FormField';

import { useForgotPassword } from '../../hooks/useForgotPassword';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const { handleForgotPassword, isLoading, error, success } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await handleForgotPassword(data.email);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="text"
          placeholder="m@example.com"
          error={!!errors.email}
          errorMessage={errors.email?.message}
          required
          disabled={isLoading}
          {...register('email')}
        />

        {error && <div className="text-sm text-destructive">{error}</div>}
        {success && (
          <div className="text-sm text-primary">
            If an account exists with that email, you will receive password reset instructions.
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          Send Reset Instructions
        </Button>

        <div className="text-center text-sm">
          Remember your password?{' '}
          <Link to="/auth/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};
