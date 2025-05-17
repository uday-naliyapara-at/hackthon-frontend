import { HiSquares2X2 } from 'react-icons/hi2';

import { AuthImage } from '@/presentation/shared/atoms/AuthImage';
import { Card, CardContent } from '@/presentation/shared/atoms/Card';
import { Icon } from '@/presentation/shared/atoms/Icon';

import { ForgotPasswordForm } from '../organisms/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg font-semibold">hello</span>
      </div>
      <Card className="mx-auto w-full max-w-[800px] overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <ForgotPasswordForm />
          </div>
          <AuthImage src="/login-placeholder.svg" alt="" fallbackSrc="/auth/placeholder.jpg" />
        </CardContent>
      </Card>
    </div>
  );
};
