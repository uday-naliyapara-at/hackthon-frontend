import { useToast } from '@/components/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export interface ToastProps {
  title?: React.ReactNode;
  description: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  containerClassName?: string;
}

const positionClasses = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

const getPositionStyles = (position: ToasterProps['position']) => {
  switch (position) {
    case 'top-left':
    case 'top-right':
      return 'flex-col-reverse';
    case 'bottom-left':
    case 'bottom-right':
      return 'flex-col';
    default:
      return 'flex-col-reverse';
  }
};

export const Toaster = ({ position = 'top-right', containerClassName }: ToasterProps = {}) => {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        ...props
      }: {
        id: string;
        title?: React.ReactNode;
        description?: React.ReactNode;
        [key: string]: unknown;
      }) {
        return (
          <Toast key={id} position={position} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport
        className={cn(
          'fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]',
          getPositionStyles(position),
          positionClasses[position],
          containerClassName
        )}
      />
    </ToastProvider>
  );
};

// Re-export useToast hook for convenience
export { useToast };
