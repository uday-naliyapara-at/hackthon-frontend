import React from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Icon } from '@/presentation/shared/atoms/Icon';

import { ThemeToggle } from './index';

// Define the props for the ThemeToggle component
const themeToggleProps: PropDef[] = [
  {
    name: 'data-testid',
    type: 'string',
    description: 'Test ID for component testing',
  },
];

export const ThemeToggleDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">ThemeToggle</h2>
        <p>
          The ThemeToggle component provides a simple button to switch between light and dark
          themes. It uses the next-themes library to manage theme state and automatically switches
          between sun and moon icons based on the current theme.
        </p>
      </div>

      <PropsTable props={themeToggleProps} />

      <ComponentExample
        name="Basic Theme Toggle"
        description="Standard theme toggle button that switches between light and dark modes"
        code={`<ThemeToggle />`}
      >
        <div className="flex justify-center p-4">
          <ThemeToggle />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Theme Toggle with Test ID"
        description="Theme toggle with a data-testid attribute for testing"
        code={`<ThemeToggle data-testid="theme-toggle" />`}
      >
        <div className="flex justify-center p-4">
          <ThemeToggle data-testid="theme-toggle" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Theme Toggle States"
        description="Visual representation of light and dark mode states"
        code={`// Light mode state
<Button variant="ghost" size="icon">
  <Icon icon={HiMoon} className="h-6 w-6" />
  <span className="sr-only">Toggle theme</span>
</Button>

// Dark mode state
<Button variant="ghost" size="icon">
  <Icon icon={HiSun} className="h-6 w-6" />
  <span className="sr-only">Toggle theme</span>
</Button>`}
      >
        <div className="flex justify-center space-x-8 p-4">
          <div className="flex flex-col items-center">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <Icon icon={HiMoon} className="h-6 w-6" />
              <span className="sr-only">Toggle theme</span>
            </button>
            <span className="mt-2 text-sm">Light Mode</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <Icon icon={HiSun} className="h-6 w-6" />
              <span className="sr-only">Toggle theme</span>
            </button>
            <span className="mt-2 text-sm">Dark Mode</span>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Navigation Context"
        description="Theme toggle used in a navigation bar"
        code={`<div className="flex items-center justify-between p-4 border-b">
  <div className="font-semibold">Application</div>
  <div className="flex items-center space-x-4">
    <a href="#" className="text-sm">Dashboard</a>
    <a href="#" className="text-sm">Settings</a>
    <ThemeToggle />
  </div>
</div>`}
      >
        <div className="flex items-center justify-between p-4 border-b rounded-md">
          <div className="font-semibold">Application</div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm">
              Dashboard
            </a>
            <a href="#" className="text-sm">
              Settings
            </a>
            <ThemeToggle />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Settings Context"
        description="Theme toggle used in a settings panel with a label"
        code={`<div className="p-4 border rounded-md">
  <h3 className="font-medium mb-4">Display Settings</h3>
  
  <div className="flex items-center justify-between">
    <div>
      <div className="font-medium">Dark Mode</div>
      <div className="text-sm text-gray-500">Toggle between light and dark theme</div>
    </div>
    <ThemeToggle />
  </div>
</div>`}
      >
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-4">Display Settings</h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-gray-500">Toggle between light and dark theme</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
