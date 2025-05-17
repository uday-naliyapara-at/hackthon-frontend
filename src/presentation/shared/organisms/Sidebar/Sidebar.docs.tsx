import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { Sidebar } from './index';

// Define the props for the Sidebar component
const sidebarProps: PropDef[] = [
  {
    name: 'isCollapsed',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the sidebar is collapsed to a minimal width',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional className for styling overrides',
  },
  {
    name: 'user',
    type: 'User',
    required: true,
    description: 'User object containing profile information for the user navigation',
  },
  {
    name: 'onLogout',
    type: '() => void',
    description: 'Optional callback function when logout is triggered',
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

export const SidebarDocs: React.FC = () => {
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
        <h2 className="text-2xl font-bold">Sidebar</h2>
        <p>
          The Sidebar component is an organism that provides navigation for the application. It
          includes a main navigation area and a user navigation section at the bottom. The sidebar
          can be collapsed into a smaller width for a minimal view.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Component Props</h3>
          <PropsTable props={sidebarProps} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">User Object Props</h3>
          <PropsTable props={userObjectProps} />
        </div>
      </div>

      <ComponentExample
        name="Default Sidebar"
        description="Expanded sidebar with navigation and user section"
        code={`// User object
const user = {
  id: '1',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  emailVerified: true,
  avatarUrl: ''
};

<Sidebar
  user={user}
  onLogout={() => console.log('Logout clicked')}
/>`}
      >
        <div className="h-[500px] border rounded-lg overflow-hidden">
          <Sidebar user={user} onLogout={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Collapsed Sidebar"
        description="Minimized sidebar view showing only icons"
        code={`<Sidebar
  isCollapsed={true}
  user={user}
  onLogout={() => console.log('Logout clicked')}
/>`}
      >
        <div className="h-[500px] border rounded-lg overflow-hidden">
          <Sidebar isCollapsed={true} user={user} onLogout={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="Sidebar with custom background color"
        code={`<Sidebar
  user={user}
  className="bg-slate-100 dark:bg-slate-800"
  onLogout={() => console.log('Logout clicked')}
/>`}
      >
        <div className="h-[500px] border rounded-lg overflow-hidden">
          <Sidebar user={user} className="bg-slate-100 dark:bg-slate-800" onLogout={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Page Layout Context"
        description="Sidebar used within a full page layout"
        code={`<div className="flex h-[600px] border rounded-lg overflow-hidden">
  <Sidebar
    user={user}
    onLogout={() => console.log('Logout clicked')}
  />
  <div className="flex-1 flex flex-col">
    <div className="h-[60px] border-b flex items-center px-4 font-medium">
      Dashboard
    </div>
    <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
      <div className="bg-background border rounded-lg p-4 shadow-sm h-full">
        Main Content Area
      </div>
    </div>
  </div>
</div>`}
      >
        <div className="flex h-[600px] border rounded-lg overflow-hidden">
          <Sidebar user={user} onLogout={() => {}} />
          <div className="flex-1 flex flex-col">
            <div className="h-[60px] border-b flex items-center px-4 font-medium">Dashboard</div>
            <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
              <div className="bg-background border rounded-lg p-4 shadow-sm h-full">
                Main Content Area
              </div>
            </div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
