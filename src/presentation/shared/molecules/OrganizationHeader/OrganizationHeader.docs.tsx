import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { OrganizationHeader } from './index';

// Define the props for the OrganizationHeader component
const organizationHeaderProps: PropDef[] = [
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Name of the organization',
  },
  {
    name: 'type',
    type: 'string',
    required: true,
    description: 'Type or category of the organization',
  },
  {
    name: 'isCollapsed',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the header is in collapsed mode (showing only the avatar)',
  },
  {
    name: 'onMenuClick',
    type: '() => void',
    description: 'Callback function when the menu button is clicked',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
];

export const OrganizationHeaderDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">OrganizationHeader</h2>
        <p>
          The OrganizationHeader component displays an organization's name and type with an optional
          menu button. It's typically used at the top of a sidebar or navigation panel to identify
          the current organization context. The component supports a collapsed state for use in
          minimized sidebars.
        </p>
      </div>

      <PropsTable props={organizationHeaderProps} />

      <ComponentExample
        name="Basic Organization Header"
        description="Standard organization header with name and type"
        code={`<OrganizationHeader 
  name="Acme Inc" 
  type="Enterprise"
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <OrganizationHeader name="Acme Inc" type="Enterprise" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Menu Click Handler"
        description="Organization header with an interactive menu button"
        code={`<OrganizationHeader 
  name="Acme Inc" 
  type="Enterprise"
  onMenuClick={() => console.log('Menu clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <OrganizationHeader
            name="Acme Inc"
            type="Enterprise"
            onMenuClick={() => alert('Menu clicked')}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Collapsed State"
        description="Organization header in collapsed mode showing only the avatar"
        code={`<OrganizationHeader 
  name="Acme Inc" 
  type="Enterprise"
  isCollapsed={true}
/>`}
      >
        <div className="w-16 border rounded-lg overflow-hidden">
          <OrganizationHeader name="Acme Inc" type="Enterprise" isCollapsed={true} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Different Organizations"
        description="Examples with different organization names and types"
        code={`<div className="space-y-4">
  <OrganizationHeader name="Acme Inc" type="Enterprise" />
  <OrganizationHeader name="Startup XYZ" type="Startup" />
  <OrganizationHeader name="Personal" type="Individual" />
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden space-y-4 p-4">
          <OrganizationHeader name="Acme Inc" type="Enterprise" />
          <OrganizationHeader name="Startup XYZ" type="Startup" />
          <OrganizationHeader name="Personal" type="Individual" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Custom Styling"
        description="Organization header with custom styling"
        code={`<OrganizationHeader 
  name="Acme Inc" 
  type="Enterprise"
  className="bg-primary/10 rounded-md"
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4">
          <OrganizationHeader
            name="Acme Inc"
            type="Enterprise"
            className="bg-primary/10 rounded-md"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Sidebar Context"
        description="Organization header used at the top of a sidebar"
        code={`<div className="w-64 border rounded-lg overflow-hidden">
  <OrganizationHeader name="Acme Inc" type="Enterprise" />
  <div className="p-4">
    <div className="p-2 text-sm text-muted-foreground border-b pb-2 mb-2">
      Navigation would go here
    </div>
    <div className="text-xs text-muted-foreground">
      Sidebar content would continue here...
    </div>
  </div>
</div>`}
      >
        <div className="w-64 border rounded-lg overflow-hidden">
          <OrganizationHeader name="Acme Inc" type="Enterprise" />
          <div className="p-4">
            <div className="p-2 text-sm text-muted-foreground border-b pb-2 mb-2">
              Navigation would go here
            </div>
            <div className="text-xs text-muted-foreground">
              Sidebar content would continue here...
            </div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
