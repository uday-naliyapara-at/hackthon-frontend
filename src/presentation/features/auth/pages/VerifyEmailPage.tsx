import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useToast } from '@/components/hooks/use-toast';

import { AuthProvider } from '../context/AuthContext';
import { useResendVerification, useVerificationStatus, useVerifyEmail } from '../hooks';
import { VerificationPendingCard } from '../organisms/VerificationPendingCard';
import { VerificationResultCard } from '../organisms/VerificationResultCard';

export const VerifyEmailPage = () => {
  return (
    <AuthProvider>
      <VerifyEmailContent />
    </AuthProvider>
  );
};

const VerifyEmailContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const hasVerified = useRef(false);
  const { toast } = useToast();

  const { verify, isLoading, isSuccess, error } = useVerifyEmail();
  const {
    resend,
    isResendDisabled,
    remainingTime,
    error: resendError,
  } = useResendVerification(email ?? undefined);
  const { status } = useVerificationStatus(email ?? undefined);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Verification Failed',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (resendError) {
      toast({
        title: 'Failed to Resend Verification',
        description: resendError,
        variant: 'destructive',
      });
    }
  }, [resendError, toast]);

  useEffect(() => {
    if (!token && !email && !hasVerified.current) {
      navigate('/auth/login');
      return;
    }

    if (token && !hasVerified.current) {
      hasVerified.current = true;
      verify(token);
    }
  }, [token, email, verify, navigate]);

  if (!token && !email) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        />
      </div>
    );
  }

  if (token) {
    const handleRetry = () => {
      if (token) {
        hasVerified.current = false;
        verify(token);
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <VerificationResultCard
          isSuccess={isSuccess}
          error={error || undefined}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!email) {
    return null;
  }

  const handleResend = async () => {
    if (email) {
      await resend(email);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <VerificationPendingCard
        email={email}
        onResend={handleResend}
        isResendDisabled={isResendDisabled}
        remainingTime={remainingTime}
        error={resendError || undefined}
        isVerified={status.isVerified}
      />
    </div>
  );
};
