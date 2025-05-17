import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { type User } from '@/domain/models/user/types';

import { TopBar } from './index';

// Define the props for the TopBar component
const topBarProps: PropDef[] = [
  {
    name: 'user',
    type: 'User',
    required: true,
    description: 'User object containing profile information',
  },
  {
    name: 'onSidebarToggle',
    type: '() => void',
    description: 'Optional callback when sidebar toggle is clicked',
  },
  {
    name: 'isSidebarCollapsed',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the sidebar is in collapsed state',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional className for styling overrides',
  },
];

export const TopBarDocs: React.FC = () => {
  // Sample user data for examples
  const sampleUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    role: 'USER',
    teamId: 1,
    emailVerified: true,
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe',
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">TopBar</h2>
        <p>
          The TopBar component is an organism that serves as the top navigation bar of the
          application. It includes a sidebar toggle button, user avatar, and a Give Kudos button.
          It's typically used in combination with a Sidebar component.
        </p>
      </div>

      <PropsTable props={topBarProps} />

      <ComponentExample
        name="Basic TopBar"
        description="Standard top bar with sidebar toggle and user avatar"
        code={`<TopBar
  user={user}
  onSidebarToggle={() => console.log('Sidebar toggle clicked')}
/>`}
      >
        <div className="border rounded-lg overflow-hidden">
          <TopBar user={sampleUser} onSidebarToggle={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Collapsed Sidebar State"
        description="TopBar with collapsed sidebar indication"
        code={`<TopBar
  user={user}
  isSidebarCollapsed={true}
  onSidebarToggle={() => console.log('Sidebar toggle clicked')}
/>`}
      >
        <div className="border rounded-lg overflow-hidden">
          <TopBar user={sampleUser} isSidebarCollapsed={true} onSidebarToggle={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="TopBar with custom background color"
        code={`<TopBar
  user={user}
  className="bg-slate-100 dark:bg-slate-800"
  onSidebarToggle={() => console.log('Sidebar toggle clicked')}
/>`}
      >
        <div className="border rounded-lg overflow-hidden">
          <TopBar 
            user={sampleUser} 
            className="bg-slate-100 dark:bg-slate-800" 
            onSidebarToggle={() => {}} 
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Layout Context"
        description="TopBar used within a full page layout"
        code={`<div className="h-[600px] border rounded-lg overflow-hidden flex flex-col">
  <TopBar
    user={user}
    onSidebarToggle={() => console.log('Sidebar toggle clicked')}
  />
  <div className="flex-1 flex">
    <div className="w-64 border-r bg-sidebar">
      <div className="p-4">Sidebar content</div>
    </div>
    <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
      <div className="bg-background border rounded-lg p-4 shadow-sm h-full">
        Main Content Area
      </div>
    </div>
  </div>
</div>`}
      >
        <div className="h-[600px] border rounded-lg overflow-hidden flex flex-col">
          <TopBar user={sampleUser} onSidebarToggle={() => {}} />
          <div className="flex-1 flex">
            <div className="w-64 border-r bg-sidebar">
              <div className="p-4">Sidebar content</div>
            </div>
            <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
              <div className="bg-background border rounded-lg p-4 shadow-sm h-full">
                Main Content Area
              </div>
            </div>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Content"
        description="Note: This example is conceptual - actual implementation would require custom styling"
        code={`<div className="border rounded-lg overflow-hidden">
  <div className="flex items-center justify-between h-[60px] px-4 border-b">
    <div className="flex items-center gap-2">
      <button className="p-2 rounded-md hover:bg-accent">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4h12a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm12 3H2a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2zm0 5H2a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2z" />
        </svg>
      </button>
      <div className="h-6 w-[1px] bg-border hidden md:block" />
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="px-4 py-1 bg-muted rounded font-medium">
        Custom Center Content
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-6 w-[1px] bg-border" />
      <button className="p-2 rounded-md hover:bg-accent">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
      </button>
    </div>
  </div>
</div>`}
      >
        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between h-[60px] px-4 border-b">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md hover:bg-accent">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 4h12a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm12 3H2a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2zm0 5H2a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2z" />
                </svg>
              </button>
              <div className="h-6 w-[1px] bg-border hidden md:block" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="px-4 py-1 bg-muted rounded font-medium">Custom Center Content</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-[1px] bg-border" />
              <button className="p-2 rounded-md hover:bg-accent">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
