import { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import { cn } from '@/lib/utils';

export interface LinkProps extends RouterLinkProps {
  variant?: 'default' | 'muted' | 'error';
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <RouterLink
        ref={ref}
        className={cn(
          'transition-colors hover:underline',
          {
            'text-primary hover:text-primary/90': variant === 'default',
            'text-muted-foreground hover:text-muted-foreground/90': variant === 'muted',
            'text-red-500 hover:text-red-600': variant === 'error',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';
