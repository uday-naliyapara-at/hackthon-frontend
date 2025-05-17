import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/presentation/shared/atoms/Button';
import { Card, CardContent, CardFooter } from '@/presentation/shared/atoms/Card';
import { VerificationStatus } from '@/presentation/shared/molecules/VerificationStatus';

export interface VerificationResultCardProps {
  /**
   * Whether verification was successful
   */
  isSuccess: boolean;
  /**
   * Error message if verification failed
   */
  error?: string;
  /**
   * Handler for retry action
   */
  onRetry?: () => void;
  /**
   * Optional className for styling
   */
  className?: string;
}

export const VerificationResultCard = ({
  isSuccess,
  error,
  onRetry,
  className,
}: VerificationResultCardProps) => {
  const navigate = useNavigate();
  const status = isSuccess ? 'success' : 'error';
  const title = isSuccess ? 'Email Verified' : 'Verification Failed';
  const description = isSuccess
    ? 'Your email has been verified successfully. You can now login to your account.'
    : error || 'Failed to verify your email. Please try again.';

  return (
    <Card className={cn('w-full max-w-md', className)} data-testid="card">
      <CardContent className="pt-6">
        <VerificationStatus status={status} title={title} description={description} />
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {!isSuccess && onRetry && (
          <Button variant="default" className="w-full" onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Button variant="ghost" className="w-full" onClick={() => navigate('/auth/login')}>
          {isSuccess ? 'Go to Login' : 'Back to Login'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerificationResultCard;
