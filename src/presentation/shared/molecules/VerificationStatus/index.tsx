import { IoAlertCircle, IoCheckmarkCircle, IoTimeOutline } from 'react-icons/io5';

import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/shared/atoms/Alert';
import { Icon } from '@/presentation/shared/atoms/Icon';

export type VerificationStatusType = 'pending' | 'success' | 'error';

export interface VerificationStatusProps {
  /**
   * Current verification status
   */
  status: VerificationStatusType;
  /**
   * Main status message
   */
  title: string;
  /**
   * Optional detailed message
   */
  description?: string;
  /**
   * Optional className for styling
   */
  className?: string;
}

const statusConfig = {
  pending: {
    icon: IoTimeOutline,
    variant: 'default' as const,
    iconClassName: 'text-muted-foreground',
  },
  success: {
    icon: IoCheckmarkCircle,
    variant: 'default' as const,
    iconClassName: 'text-success-foreground',
  },
  error: {
    icon: IoAlertCircle,
    variant: 'destructive' as const,
    iconClassName: 'text-destructive-foreground',
  },
};

export const VerificationStatus = ({
  status,
  title,
  description,
  className,
}: VerificationStatusProps) => {
  const { icon: StatusIcon, variant, iconClassName } = statusConfig[status];

  return (
    <Alert
      variant={variant}
      className={cn('flex items-center gap-4', className)}
      role="status"
      aria-live={status === 'error' ? 'assertive' : 'polite'}
    >
      <Icon
        icon={StatusIcon}
        className={cn('h-5 w-5 flex-shrink-0', iconClassName)}
        aria-hidden="true"
        data-testid={`verification-${status}-icon`}
      />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </div>
    </Alert>
  );
};

export default VerificationStatus;
