import { FC } from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';

import { cn } from '@/lib/utils';

import { Icon } from '../../atoms/Icon';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Icon
      icon={HiOutlineArrowPath}
      className={cn('animate-spin', sizeClasses[size], className)}
      data-testid="loading-spinner"
    />
  );
};
