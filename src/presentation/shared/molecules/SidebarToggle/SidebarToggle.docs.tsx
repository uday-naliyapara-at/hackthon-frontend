import React, { useState } from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { SidebarToggle } from './index';

// Define the props for the SidebarToggle component
const sidebarToggleProps: PropDef[] = [
  {
    name: 'isCollapsed',
    type: 'boolean',
    required: true,
    description: 'Whether the sidebar is currently collapsed',
  },
  {
    name: 'onClick',
    type: '() => void',
    description: 'Callback function when the toggle button is clicked',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
  {
    name: 'data-testid',
    type: 'string',
    description: 'Test ID for testing purposes',
  },
];

export const SidebarToggleDocs: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">SidebarToggle</h2>
        <p>
          The SidebarToggle component provides a button to toggle the collapsed state of a sidebar.
          It visually indicates the current state of the sidebar through icon rotation and is
          typically placed in a navigation bar or a sidebar header.
        </p>
      </div>

      <PropsTable props={sidebarToggleProps} />

      <ComponentExample
        name="Basic Sidebar Toggle"
        description="Standard sidebar toggle button showing collapsed or expanded state"
        code={`const [isCollapsed, setIsCollapsed] = useState(false);
  
const toggleSidebar = () => {
  setIsCollapsed(prev => !prev);
};

<SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />`}
      >
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />
          <div className="ml-4 text-sm text-muted-foreground">
            Sidebar is {isCollapsed ? 'collapsed' : 'expanded'}
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Collapsed State"
        description="Sidebar toggle in the collapsed state"
        code={`<SidebarToggle isCollapsed={true} onClick={() => {}} />`}
      >
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <SidebarToggle isCollapsed={true} onClick={() => {}} />
          <div className="ml-4 text-sm text-muted-foreground">Sidebar is collapsed</div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Expanded State"
        description="Sidebar toggle in the expanded state"
        code={`<SidebarToggle isCollapsed={false} onClick={() => {}} />`}
      >
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <SidebarToggle isCollapsed={false} onClick={() => {}} />
          <div className="ml-4 text-sm text-muted-foreground">Sidebar is expanded</div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="Sidebar toggle with custom styling applied"
        code={`<SidebarToggle 
  isCollapsed={false} 
  onClick={() => {}} 
  className="bg-muted hover:bg-muted/80"
/>`}
      >
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <SidebarToggle
            isCollapsed={false}
            onClick={() => {}}
            className="bg-muted hover:bg-muted/80"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Navigation Context"
        description="Sidebar toggle used in a navigation bar"
        code={`<div className="h-16 border rounded-lg bg-background shadow-sm flex items-center px-4 justify-between">
  <div className="flex items-center">
    <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />
    <div className="ml-4 font-semibold">Application Name</div>
  </div>
  <div className="flex items-center space-x-4">
    <div className="w-8 h-8 rounded-full bg-muted"></div>
  </div>
</div>`}
      >
        <div className="h-16 border rounded-lg bg-background shadow-sm flex items-center px-4 justify-between">
          <div className="flex items-center">
            <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />
            <div className="ml-4 font-semibold">Application Name</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Interactive Sidebar Example"
        description="A demo of a sidebar toggle controlling a sidebar's state"
        code={`const [isCollapsed, setIsCollapsed] = useState(false);
  
const toggleSidebar = () => {
  setIsCollapsed(prev => !prev);
};

<div className="border rounded-lg overflow-hidden">
  <div className="h-14 border-b bg-background flex items-center px-4">
    <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />
    <div className="ml-4 font-semibold">Dashboard</div>
  </div>
  <div className="flex h-64">
    <div 
      className="border-r bg-muted/20 transition-all duration-300 h-full flex flex-col" 
      style={{ width: isCollapsed ? '60px' : '200px' }}
    >
      {/* Sidebar content */}
      <div className="p-3">
        <div className={isCollapsed ? "w-6 h-6 bg-muted rounded-md mb-4" : "h-8 bg-muted rounded-md mb-4"}></div>
        <div className={isCollapsed ? "w-6 h-6 bg-muted rounded-md mb-4" : "h-8 bg-muted rounded-md mb-4"}></div>
        <div className={isCollapsed ? "w-6 h-6 bg-muted rounded-md mb-4" : "h-8 bg-muted rounded-md mb-4"}></div>
      </div>
    </div>
    <div className="flex-1 p-4">
      <div className="text-sm text-muted-foreground">
        Main content area
      </div>
    </div>
  </div>
</div>`}
      >
        <div className="border rounded-lg overflow-hidden">
          <div className="h-14 border-b bg-background flex items-center px-4">
            <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />
            <div className="ml-4 font-semibold">Dashboard</div>
          </div>
          <div className="flex h-64">
            <div
              className="border-r bg-muted/20 transition-all duration-300 h-full flex flex-col"
              style={{ width: isCollapsed ? '60px' : '200px' }}
            >
              {/* Sidebar content */}
              <div className="p-3">
                <div
                  className={
                    isCollapsed
                      ? 'w-6 h-6 bg-muted rounded-md mb-4'
                      : 'h-8 bg-muted rounded-md mb-4'
                  }
                ></div>
                <div
                  className={
                    isCollapsed
                      ? 'w-6 h-6 bg-muted rounded-md mb-4'
                      : 'h-8 bg-muted rounded-md mb-4'
                  }
                ></div>
                <div
                  className={
                    isCollapsed
                      ? 'w-6 h-6 bg-muted rounded-md mb-4'
                      : 'h-8 bg-muted rounded-md mb-4'
                  }
                ></div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="text-sm text-muted-foreground">Main content area</div>
            </div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
