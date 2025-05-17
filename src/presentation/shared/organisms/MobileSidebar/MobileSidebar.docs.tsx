import React, { useState } from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Button } from '@/presentation/shared/atoms/Button';

import { MobileSidebar } from './index';

// Define the props for the MobileSidebar component
const mobileSidebarProps: PropDef[] = [
  {
    name: 'open',
    type: 'boolean',
    required: true,
    description: 'Whether the mobile sidebar is open',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    required: true,
    description: 'Callback function when the open state changes',
  },
  {
    name: 'user',
    type: 'User',
    description: 'Optional user object containing profile information',
  },
  {
    name: 'onLogout',
    type: '() => void',
    description: 'Optional callback for logout action',
  },
];

// User object interface props
const userObjectProps: PropDef[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique identifier for the user',
  },
  {
    name: 'firstName',
    type: 'string',
    required: true,
    description: "User's first name",
  },
  {
    name: 'lastName',
    type: 'string',
    required: true,
    description: "User's last name",
  },
  {
    name: 'email',
    type: 'string',
    required: true,
    description: "User's email address",
  },
  {
    name: 'emailVerified',
    type: 'boolean',
    required: true,
    description: "Whether the user's email is verified",
  },
  {
    name: 'avatarUrl',
    type: 'string',
    description: "URL to the user's avatar image",
  },
];

export const MobileSidebarDocs: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Sample user data
  const user = {
    id: '1',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    emailVerified: true,
    avatarUrl: '',
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">MobileSidebar</h2>
        <p>
          The MobileSidebar component is an organism that provides navigation for mobile devices. It
          displays as a slide-out drawer that contains navigation items and user settings. It's
          designed to replace the desktop sidebar on smaller screens.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Component Props</h3>
          <PropsTable props={mobileSidebarProps} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">User Object Props</h3>
          <PropsTable props={userObjectProps} />
        </div>
      </div>

      <ComponentExample
        name="Mobile Sidebar Demo"
        description="Interactive demo showing the mobile sidebar drawer"
        code={`// Component state
const [open, setOpen] = useState(false);

// User object
const user = {
  id: '1',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  emailVerified: true,
  avatarUrl: ''
};

// Open sidebar handler
const handleOpenSidebar = () => {
  setOpen(true);
};

<div>
  <Button onClick={handleOpenSidebar}>
    Open Mobile Sidebar
  </Button>
  
  <MobileSidebar
    open={open}
    onOpenChange={setOpen}
    user={user}
    onLogout={() => console.log('Logout clicked')}
  />
</div>`}
      >
        <div className="p-4 border rounded-lg">
          <Button onClick={() => setOpen(true)}>Open Mobile Sidebar</Button>

          <MobileSidebar open={open} onOpenChange={setOpen} user={user} onLogout={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Mobile Layout Context"
        description="Mobile sidebar in a mobile layout with content"
        code={`<div className="w-full max-w-md border rounded-lg overflow-hidden h-[500px] relative bg-background">
  {/* Mobile header */}
  <div className="h-14 border-b px-4 flex items-center">
    <div className="w-8 h-8"></div>
    <div className="flex-1 text-center font-medium">Mobile App</div>
    <div className="w-8 h-8"></div>
  </div>
  
  {/* Main content */}
  <div className="p-4">
    <h3 className="text-lg font-medium mb-4">Main Content</h3>
    <p className="text-sm text-muted-foreground mb-4">
      This is where your main application content would be displayed.
      Click the button below to open the mobile navigation sidebar.
    </p>
    <Button onClick={() => setOpen(true)}>
      Open Navigation
    </Button>
  </div>
  
  <MobileSidebar
    open={open}
    onOpenChange={setOpen}
    user={user}
    onLogout={() => console.log('Logout clicked')}
  />
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden h-[500px] relative bg-background">
          {/* Mobile header */}
          <div className="h-14 border-b px-4 flex items-center">
            <div className="w-8 h-8"></div>
            <div className="flex-1 text-center font-medium">Mobile App</div>
            <div className="w-8 h-8"></div>
          </div>

          {/* Main content */}
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Main Content</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is where your main application content would be displayed. Click the button below
              to open the mobile navigation sidebar.
            </p>
            <Button onClick={() => setOpen(true)}>Open Navigation</Button>
          </div>

          <MobileSidebar open={open} onOpenChange={setOpen} user={user} onLogout={() => {}} />
        </div>
      </ComponentExample>

      <div className="p-4 border rounded-md bg-amber-50 text-amber-800">
        <p className="text-sm">
          <strong>Note:</strong> The MobileSidebar component is primarily designed for mobile
          viewport sizes. When testing on desktop, the component will still function but may not
          appear exactly as it would on a mobile device.
        </p>
      </div>
    </div>
  );
};
