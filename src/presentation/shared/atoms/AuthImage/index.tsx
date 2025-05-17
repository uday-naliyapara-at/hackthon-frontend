import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface AuthImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const AuthImage = forwardRef<HTMLImageElement, AuthImageProps>(
  ({ className, src, fallbackSrc = '/placeholder.svg', alt = '', ...props }, ref) => {
    return (
      <div className="relative hidden h-full bg-muted md:block">
        <img
          ref={ref}
          src={src || fallbackSrc}
          alt={alt}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'dark:brightness-[0.2] dark:grayscale',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

AuthImage.displayName = 'AuthImage';
