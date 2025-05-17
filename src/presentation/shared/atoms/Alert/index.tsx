import { forwardRef } from 'react';

import {
  Alert as ShadcnAlert,
  AlertDescription as ShadcnAlertDescription,
  AlertTitle as ShadcnAlertTitle,
} from '@/components/ui/alert';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}
export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <ShadcnAlert ref={ref} {...props} />;
});

const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>((props, ref) => {
  return <ShadcnAlertTitle ref={ref} {...props} />;
});

const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>((props, ref) => {
  return <ShadcnAlertDescription ref={ref} {...props} />;
});

Alert.displayName = 'Alert';
AlertTitle.displayName = 'AlertTitle';
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
