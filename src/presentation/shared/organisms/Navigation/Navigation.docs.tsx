import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { Navigation } from './index';

// Define the props for the Navigation component
const navigationProps: PropDef[] = [
  {
    name: 'isCollapsed',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the navigation is in collapsed mode',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional className for styling overrides',
  },
  {
    name: 'onOrganizationMenuClick',
    type: '() => void',
    description: 'Optional callback when organization menu is clicked',
  },
  {
    name: 'onNavigationItemClick',
    type: '() => void',
    description: 'Optional callback when a navigation item is clicked',
  },
];

export const NavigationDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Navigation</h2>
        <p>
          The Navigation component is an organism that displays the main application navigation. It
          includes an organization header and multiple navigation sections with items. The
          navigation can be collapsed to show only icons for a more compact view.
        </p>
      </div>

      <PropsTable props={navigationProps} />

      <ComponentExample
        name="Expanded Navigation"
        description="Standard expanded navigation with sections and items"
        code={`<Navigation
  onOrganizationMenuClick={() => console.log('Organization menu clicked')}
  onNavigationItemClick={() => console.log('Navigation item clicked')}
/>`}
      >
        <div className="h-[500px] w-64 border rounded-lg overflow-hidden bg-sidebar">
          <Navigation onOrganizationMenuClick={() => {}} onNavigationItemClick={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Collapsed Navigation"
        description="Compact navigation view showing only icons"
        code={`<Navigation
  isCollapsed={true}
  onOrganizationMenuClick={() => console.log('Organization menu clicked')}
  onNavigationItemClick={() => console.log('Navigation item clicked')}
/>`}
      >
        <div className="h-[500px] w-16 border rounded-lg overflow-hidden bg-sidebar">
          <Navigation
            isCollapsed={true}
            onOrganizationMenuClick={() => {}}
            onNavigationItemClick={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="Navigation with custom background color"
        code={`<Navigation
  className="bg-slate-100 dark:bg-slate-800"
  onOrganizationMenuClick={() => console.log('Organization menu clicked')}
  onNavigationItemClick={() => console.log('Navigation item clicked')}
/>`}
      >
        <div className="h-[500px] w-64 border rounded-lg overflow-hidden">
          <Navigation
            className="bg-slate-100 dark:bg-slate-800"
            onOrganizationMenuClick={() => {}}
            onNavigationItemClick={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Sidebar Context"
        description="Navigation used within a sidebar layout"
        code={`<div className="h-[500px] w-64 border rounded-lg overflow-hidden bg-sidebar flex flex-col">
  <div className="flex-1 overflow-y-auto">
    <Navigation
      onOrganizationMenuClick={() => console.log('Organization menu clicked')}
      onNavigationItemClick={() => console.log('Navigation item clicked')}
    />
  </div>
  <div className="flex-shrink-0 border-t p-2">
    <div className="p-2 rounded-md bg-card">User navigation area</div>
  </div>
</div>`}
      >
        <div className="h-[500px] w-64 border rounded-lg overflow-hidden bg-sidebar flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Navigation onOrganizationMenuClick={() => {}} onNavigationItemClick={() => {}} />
          </div>
          <div className="flex-shrink-0 border-t p-2">
            <div className="p-2 rounded-md bg-card">User navigation area</div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
