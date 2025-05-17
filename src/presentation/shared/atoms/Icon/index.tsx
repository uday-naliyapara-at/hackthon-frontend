import { forwardRef } from 'react';
import { IconBaseProps, IconType } from 'react-icons';

export interface IconProps extends IconBaseProps {
  icon: IconType;
  'data-testid'?: string;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ icon: IconComponent, 'data-testid': dataTestId, ...props }, ref) => {
    return (
      <span ref={ref} data-testid={`${dataTestId}-wrapper`}>
        <IconComponent data-testid={dataTestId} {...props} />
      </span>
    );
  }
);

Icon.displayName = 'Icon';
