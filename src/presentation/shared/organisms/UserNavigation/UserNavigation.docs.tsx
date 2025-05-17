import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { UserNavigation } from './index';

// Define the props for the UserNavigation component
const userNavigationProps: PropDef[] = [
  {
    name: 'user',
    type: 'User',
    required: true,
    description: 'User object containing profile information',
  },
  {
    name: 'onLogout',
    type: '() => void',
    description: 'Optional callback for logout action',
  },
  {
    name: 'isMobile',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the navigation is in mobile view',
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

export const UserNavigationDocs: React.FC = () => {
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
        <h2 className="text-2xl font-bold">UserNavigation</h2>
        <p>
          The UserNavigation component is an organism that displays user information with a dropdown
          menu, providing access to profile settings, account information, and logout functionality.
          It's typically used in the sidebar or top navigation area of an application.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Component Props</h3>
          <PropsTable props={userNavigationProps} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">User Object Props</h3>
          <PropsTable props={userObjectProps} />
        </div>
      </div>

      <ComponentExample
        name="Default User Navigation"
        description="Standard user navigation with dropdown menu"
        code={`// User object
const user = {
  id: '1',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  emailVerified: true,
  avatarUrl: ''
};

<UserNavigation
  user={user}
  onLogout={() => console.log('Logout clicked')}
/>`}
      >
        <div className="p-4 border rounded-lg">
          <UserNavigation user={user} onLogout={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Mobile User Navigation"
        description="User navigation in mobile view mode"
        code={`<UserNavigation
  user={user}
  onLogout={() => console.log('Logout clicked')}
  isMobile={true}
/>`}
      >
        <div className="p-4 border rounded-lg">
          <UserNavigation user={user} onLogout={() => {}} isMobile={true} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Sidebar Context"
        description="User navigation used in a sidebar footer"
        code={`<div className="w-64 h-[400px] border rounded-lg overflow-hidden flex flex-col bg-sidebar">
  <div className="flex-1 p-4">
    <div className="text-sm font-medium mb-2">Sidebar Content</div>
    <div className="bg-card/50 p-2 rounded mb-2">Navigation Item 1</div>
    <div className="bg-card/50 p-2 rounded mb-2">Navigation Item 2</div>
    <div className="bg-card/50 p-2 rounded">Navigation Item 3</div>
  </div>
  <div className="flex-shrink-0 border-t border-border/50 bg-sidebar/50 p-2">
    <UserNavigation
      user={user}
      onLogout={() => console.log('Logout clicked')}
    />
  </div>
</div>`}
      >
        <div className="w-64 h-[400px] border rounded-lg overflow-hidden flex flex-col bg-sidebar">
          <div className="flex-1 p-4">
            <div className="text-sm font-medium mb-2">Sidebar Content</div>
            <div className="bg-card/50 p-2 rounded mb-2">Navigation Item 1</div>
            <div className="bg-card/50 p-2 rounded mb-2">Navigation Item 2</div>
            <div className="bg-card/50 p-2 rounded">Navigation Item 3</div>
          </div>
          <div className="flex-shrink-0 border-t border-border/50 bg-sidebar/50 p-2">
            <UserNavigation user={user} onLogout={() => {}} />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Mobile Navigation Layout"
        description="Mobile user navigation in a mobile sidebar layout"
        code={`<div className="w-full max-w-xs border rounded-lg overflow-hidden p-4 bg-sidebar">
  <div className="mb-6">
    <UserNavigation
      user={user}
      onLogout={() => console.log('Logout clicked')}
      isMobile={true}
    />
  </div>
  <div className="space-y-2">
    <div className="bg-card/50 p-2 rounded">Mobile Navigation Item 1</div>
    <div className="bg-card/50 p-2 rounded">Mobile Navigation Item 2</div>
    <div className="bg-card/50 p-2 rounded">Mobile Navigation Item 3</div>
  </div>
</div>`}
      >
        <div className="w-full max-w-xs border rounded-lg overflow-hidden p-4 bg-sidebar">
          <div className="mb-6">
            <UserNavigation user={user} onLogout={() => {}} isMobile={true} />
          </div>
          <div className="space-y-2">
            <div className="bg-card/50 p-2 rounded">Mobile Navigation Item 1</div>
            <div className="bg-card/50 p-2 rounded">Mobile Navigation Item 2</div>
            <div className="bg-card/50 p-2 rounded">Mobile Navigation Item 3</div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
