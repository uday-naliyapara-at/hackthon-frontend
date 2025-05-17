import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/presentation/shared/atoms/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/presentation/shared/atoms/Card';
// import { ResendButton } from '@/presentation/shared/molecules/ResendButton';
import { VerificationStatus } from '@/presentation/shared/molecules/VerificationStatus';

export interface VerificationPendingCardProps {
  /**
   * Email address to verify
   */
  email: string;
  /**
   * Handler for resend verification email
   */
  onResend: () => Promise<void>;
  /**
   * Whether resend is disabled
   */
  isResendDisabled?: boolean;
  /**
   * Remaining time in seconds before next resend attempt
   */
  remainingTime?: number;
  /**
   * Whether the email is verified
   */
  isVerified?: boolean;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Optional className for styling
   */
  className?: string;
}

export const VerificationPendingCard = ({
  email,
  // onResend,
  // isResendDisabled,
  // remainingTime = 0,
  isVerified = false,
  error,
  className,
}: VerificationPendingCardProps) => {
  const navigate = useNavigate();

  const getStatus = () => {
    if (error) return 'error';
    if (isVerified) return 'success';
    return 'pending';
  };

  const getTitle = () => {
    if (error) return 'Verification Failed';
    if (isVerified) return 'Email Verified';
    return `We sent a verification link to ${email}`;
  };

  const getDescription = () => {
    if (error) return error;
    if (isVerified)
      return 'Your email has been verified successfully. You can now login to your account.';
    return "Click the link in the email to verify your account. If you don't see it, check your spam folder.";
  };

  return (
    <Card className={cn('w-full max-w-md', className)} data-testid="card">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-center">
          {isVerified ? 'Email Verified' : 'Check Your Email'}
        </h1>
      </CardHeader>

      <CardContent className="space-y-4">
        <VerificationStatus
          status={getStatus()}
          title={getTitle()}
          description={getDescription()}
        />

        {!isVerified && (
          <div className="text-center text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or try resending it."}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {/* {!isVerified && (
          <ResendButton
            onResend={onResend}
            disabled={isResendDisabled}
            remainingTime={remainingTime}
            className="w-full"
            variant="ghost"
          />
        )} */}
        {/* <Button
          variant="link"
          className="text-sm text-muted-foreground hover:text-primary"
          onClick={() => navigate('/auth/login')}
        >
          {isVerified ? 'Go to login' : 'Back to login'}
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export default VerificationPendingCard;
