import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { UserCard } from './index';

// Define the props for the UserCard component
const userCardProps: PropDef[] = [
  {
    name: 'user',
    type: 'User',
    required: true,
    description: 'User object containing profile information',
  },
  {
    name: 'showDropdownIndicator',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether to show dropdown indicator',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional className for styling overrides',
  },
];

// Define the User object interface props
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

export const UserCardDocs: React.FC = () => {
  // Sample user data
  const user = {
    id: '1',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    emailVerified: true,
    avatarUrl: '',
  };

  const user2 = {
    id: '2',
    firstName: 'Morgan',
    lastName: 'Smith',
    email: 'morgan.smith@example.com',
    emailVerified: true,
    avatarUrl: '',
  };

  const user3 = {
    id: '3',
    firstName: 'Taylor',
    lastName: 'Wilson',
    email: 'taylor.wilson@example.com',
    emailVerified: false,
    avatarUrl: '',
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">UserCard</h2>
        <p>
          The UserCard component displays a user's profile information including their avatar, name,
          and email. It's commonly used in user interfaces for displaying the current user, in
          dropdown menus, or in user lists.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Component Props</h3>
          <PropsTable props={userCardProps} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">User Object Props</h3>
          <PropsTable props={userObjectProps} />
        </div>
      </div>

      <ComponentExample
        name="Basic User Card"
        description="Standard user card displaying name and email with avatar"
        code={`// User object
const user = {
  id: '1',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  emailVerified: true,
  avatarUrl: ''
};

<UserCard user={user} />`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <UserCard user={user} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Dropdown Indicator"
        description="User card with a dropdown indicator, typically used in menus"
        code={`<UserCard 
  user={user} 
  showDropdownIndicator={true} 
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <UserCard user={user} showDropdownIndicator={true} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="User card with custom styling applied"
        code={`<UserCard 
  user={user} 
  className="bg-muted/30 border rounded-md" 
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <UserCard user={user} className="bg-muted/30 border rounded-md" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Navigation Context"
        description="User card used in a navigation or sidebar context"
        code={`<div className="border rounded-md p-2 bg-card w-64">
  <div className="mb-4 pb-2 border-b text-sm font-medium">Account</div>
  <UserCard user={user} />
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <div className="border rounded-md p-2 bg-card w-64">
            <div className="mb-4 pb-2 border-b text-sm font-medium">Account</div>
            <UserCard user={user} />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Multiple Users"
        description="Multiple user cards displayed in a list"
        code={`<div className="space-y-2">
  <UserCard user={user1} />
  <UserCard user={user2} />
  <UserCard user={user3} />
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <div className="space-y-2">
            <UserCard user={user} />
            <UserCard user={user2} />
            <UserCard user={user3} />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Dropdown Menu"
        description="User card with dropdown indicator used in a dropdown menu"
        code={`<div className="border rounded-md shadow-md p-4 bg-card w-64">
  <div className="mb-4 pb-2 border-b text-sm font-medium">Current User</div>
  <UserCard 
    user={user} 
    showDropdownIndicator={true} 
  />
  <div className="mt-4 pt-2 border-t">
    <div className="py-1 px-2 text-sm hover:bg-muted rounded-sm">Profile Settings</div>
    <div className="py-1 px-2 text-sm hover:bg-muted rounded-sm">Account</div>
    <div className="py-1 px-2 text-sm hover:bg-muted rounded-sm">Sign Out</div>
  </div>
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <div className="border rounded-md shadow-md p-4 bg-card w-64">
            <div className="mb-4 pb-2 border-b text-sm font-medium">Current User</div>
            <UserCard user={user} showDropdownIndicator={true} />
            <div className="mt-4 pt-2 border-t">
              <div className="py-1 px-2 text-sm hover:bg-muted rounded-sm">Profile Settings</div>
              <div className="py-1 px-2 text-sm hover:bg-muted rounded-sm">Account</div>
              <div className="py-1 px-2 text-sm hover:bg-muted rounded-sm">Sign Out</div>
            </div>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Header Context"
        description="User card used in an application header"
        code={`<div className="h-16 border rounded-lg bg-background shadow-sm flex items-center px-4 justify-between">
  <div className="font-semibold">Application Name</div>
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <span>Notifications</span>
    </div>
    <UserCard 
      user={user} 
      showDropdownIndicator={true} 
      className="hover:bg-muted" 
    />
  </div>
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <div className="h-16 border rounded-lg bg-background shadow-sm flex items-center px-4 justify-between">
            <div className="font-semibold">Application Name</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span>Notifications</span>
              </div>
              <UserCard user={user} showDropdownIndicator={true} className="hover:bg-muted" />
            </div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
