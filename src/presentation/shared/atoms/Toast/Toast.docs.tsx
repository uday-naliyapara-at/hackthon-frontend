import React from 'react';

import { useToast } from '@/components/hooks/use-toast';
import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Button } from '@/presentation/shared/atoms/Button';
import { Card } from '@/presentation/shared/atoms/Card';
import { Toaster } from '@/presentation/shared/atoms/Toast';

// Define the props for the Toast component
const toastProps: PropDef[] = [
  {
    name: 'title',
    type: 'React.ReactNode',
    description: 'The title of the toast notification (optional)',
  },
  {
    name: 'description',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to be displayed in the toast',
  },
  {
    name: 'variant',
    type: "'default' | 'destructive'",
    defaultValue: 'default',
    description: 'The variant of the toast that determines its appearance',
  },
];

// Define the props for the Toaster component
const toasterProps: PropDef[] = [
  {
    name: 'position',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    defaultValue: "'top-right'",
    description: 'Position of the toast container on the screen',
  },
  {
    name: 'containerClassName',
    type: 'string',
    description: 'Additional CSS classes to apply to the toast container',
  },
];

export const ToastDocs: React.FC = () => {
  const { toast } = useToast();

  const showBasicToast = () => {
    toast({
      title: 'Toast Notification',
      description: 'This is a basic toast notification',
    });
  };

  const showDestructiveToast = () => {
    toast({
      title: 'Error',
      description: 'There was a problem with your request',
      variant: 'destructive',
    });
  };

  const showSimpleToast = () => {
    toast({
      description: 'Changes have been successfully saved',
    });
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Toast</h2>
        <p>
          The Toast component displays brief, non-modal notifications that provide quick feedback on
          the outcome of an action or system event. Toasts appear temporarily and disappear
          automatically after a set duration.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Toast Props</h3>
        <PropsTable props={toastProps} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Toaster Props</h3>
        <PropsTable props={toasterProps} />
      </div>

      <ComponentExample
        name="Basic Toast"
        description="A simple toast notification with a title and description"
        code={`import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/presentation/shared/atoms/Button';

const ShowToast = () => {
  const { toast } = useToast();
  
  const handleShowToast = () => {
    toast({
      title: "Toast Notification",
      description: "This is a basic toast notification",
    });
  };
  
  return (
    <Button onClick={handleShowToast}>
      Show Toast
    </Button>
  );
};`}
      >
        <Card className="p-4">
          <Button onClick={showBasicToast}>Show Toast</Button>
          <div className="mt-4 text-xs text-gray-500 italic">
            Click the button above to show an actual toast notification
          </div>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="Destructive Toast"
        description="A toast with destructive styling for errors or warnings"
        code={`import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/presentation/shared/atoms/Button';

const DestructiveToast = () => {
  const { toast } = useToast();
  
  const handleShowToast = () => {
    toast({
      title: "Error",
      description: "There was a problem with your request",
      variant: "destructive",
    });
  };
  
  return (
    <Button variant="destructive" onClick={handleShowToast}>
      Show Error Toast
    </Button>
  );
};`}
      >
        <Card className="p-4">
          <Button variant="destructive" onClick={showDestructiveToast}>
            Show Error Toast
          </Button>
          <div className="mt-4 text-xs text-gray-500 italic">
            Click the button above to show an error toast notification
          </div>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="Description-Only Toast"
        description="A toast with only a description and no title"
        code={`import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/presentation/shared/atoms/Button';

const DescriptionOnlyToast = () => {
  const { toast } = useToast();
  
  const handleShowToast = () => {
    toast({
      description: "Changes have been successfully saved",
    });
  };
  
  return (
    <Button variant="outline" onClick={handleShowToast}>
      Show Simple Toast
    </Button>
  );
};`}
      >
        <Card className="p-4">
          <Button variant="outline" onClick={showSimpleToast}>
            Show Simple Toast
          </Button>
          <div className="mt-4 text-xs text-gray-500 italic">
            Click the button above to show a description-only toast notification
          </div>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="Custom Position"
        description="Configuring the position of toasts with the Toaster component"
        code={`// In your layout file
import { Toaster } from '@/presentation/shared/atoms/Toast';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  );
}`}
      >
        <Card className="p-4">
          <div className="border rounded-lg p-6 max-w-md mx-auto shadow-md bg-gray-50 dark:bg-gray-800">
            <div className="mb-4 text-center">App content</div>

            <div className="relative h-40 border border-dashed rounded-md flex items-center justify-center">
              <p className="text-sm text-gray-500">
                The Toaster component is responsible for positioning and managing toast
                notifications
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500 italic text-center">
              Each example above shows a real implementation of the toast system
            </div>
          </div>
        </Card>
      </ComponentExample>

      {/* Include the Toaster component to actually show the toasts */}
      <Toaster />
    </div>
  );
};
