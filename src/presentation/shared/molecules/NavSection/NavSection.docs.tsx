import React from 'react';
import { MdChat, MdHistory, MdHome, MdPerson, MdSchool, MdSettings } from 'react-icons/md';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { NavSection } from './index';

// Define the props for the NavSection component
const navSectionProps: PropDef[] = [
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Title of the navigation section',
  },
  {
    name: 'items',
    type: 'NavSectionItem[]',
    required: true,
    description: 'Array of navigation items to display',
  },
  {
    name: 'isCollapsed',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the navigation section is collapsed (showing only icons)',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
];

// Define the NavSectionItem interface props
const navSectionItemProps: PropDef[] = [
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Display name of the navigation item',
  },
  {
    name: 'icon',
    type: 'IconType',
    required: true,
    description: 'Icon component from a React icons library',
  },
  {
    name: 'onClick',
    type: '() => void',
    description: 'Callback function when the item is clicked',
  },
  {
    name: 'data-testid',
    type: 'string',
    description: 'Test ID for testing purposes',
  },
  {
    name: 'to',
    type: 'To',
    description: 'Route path for navigation (from react-router)',
  },
  {
    name: 'subItems',
    type: 'Omit<NavSectionItem, "subItems">[]',
    description: 'Array of sub-navigation items for nested navigation',
  },
];

export const NavSectionDocs: React.FC = () => {
  // Sample navigation items
  const mainNavItems = [
    {
      name: 'Home',
      icon: MdHome,
      to: '#',
    },
    {
      name: 'Chat',
      icon: MdChat,
      to: '#',
    },
    {
      name: 'Settings',
      icon: MdSettings,
      subItems: [
        {
          name: 'Profile',
          icon: MdPerson,
          to: '#',
        },
        {
          name: 'Preferences',
          icon: MdSettings,
          to: '#',
        },
      ],
    },
    {
      name: 'History',
      icon: MdHistory,
      to: '#',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">NavSection</h2>
        <p>
          The NavSection component creates a navigational section with a title and a list of items.
          It supports collapsible nested navigation, icons, and links. This component is typically
          used within a sidebar to organize navigation items into logical groups.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Component Props</h3>
          <PropsTable props={navSectionProps} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">NavSectionItem Interface</h3>
          <PropsTable props={navSectionItemProps} />
        </div>
      </div>

      <ComponentExample
        name="Basic Navigation Section"
        description="Standard navigation section with a title and items"
        code={`const navItems = [
  {
    name: 'Home',
    icon: MdHome,
    to: '#'
  },
  {
    name: 'Chat',
    icon: MdChat,
    to: '#'
  },
  {
    name: 'Settings',
    icon: MdSettings,
    to: '#'
  },
  {
    name: 'History',
    icon: MdHistory,
    to: '#'
  }
];

<NavSection
  title="Main Navigation"
  items={navItems}
/>`}
      >
        <div className="w-64 border rounded-lg overflow-hidden">
          <NavSection
            title="Main Navigation"
            items={[
              {
                name: 'Home',
                icon: MdHome,
                to: '#',
              },
              {
                name: 'Chat',
                icon: MdChat,
                to: '#',
              },
              {
                name: 'Settings',
                icon: MdSettings,
                to: '#',
              },
              {
                name: 'History',
                icon: MdHistory,
                to: '#',
              },
            ]}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Nested Navigation"
        description="Navigation section with nested sub-items"
        code={`const navItems = [
  {
    name: 'Home',
    icon: MdHome,
    to: '#'
  },
  {
    name: 'Settings',
    icon: MdSettings,
    subItems: [
      {
        name: 'Profile',
        icon: MdPerson,
        to: '#'
      },
      {
        name: 'Preferences',
        icon: MdSettings,
        to: '#'
      }
    ]
  },
  {
    name: 'History',
    icon: MdHistory,
    to: '#'
  }
];

<NavSection
  title="Advanced Navigation"
  items={navItems}
/>`}
      >
        <div className="w-64 border rounded-lg overflow-hidden">
          <NavSection title="Advanced Navigation" items={mainNavItems} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Collapsed State"
        description="Navigation section in collapsed mode showing only icons"
        code={`<NavSection
  title="Main Navigation"
  items={navItems}
  isCollapsed={true}
/>`}
      >
        <div className="w-16 border rounded-lg overflow-hidden">
          <NavSection title="Main Navigation" items={mainNavItems} isCollapsed={true} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Multiple Sections"
        description="Multiple navigation sections organized in a sidebar"
        code={`const mainNavItems = [
  { name: 'Home', icon: MdHome, to: '#' },
  { name: 'Chat', icon: MdChat, to: '#' }
];

const settingsNavItems = [
  { name: 'Account', icon: MdPerson, to: '#' },
  { name: 'Preferences', icon: MdSettings, to: '#' }
];

const learnNavItems = [
  { name: 'Tutorials', icon: MdSchool, to: '#' },
  { name: 'Documentation', icon: MdHistory, to: '#' }
];

<div className="flex flex-col space-y-4">
  <NavSection title="Main" items={mainNavItems} />
  <NavSection title="Settings" items={settingsNavItems} />
  <NavSection title="Learn" items={learnNavItems} />
</div>`}
      >
        <div className="w-64 border rounded-lg overflow-hidden p-2">
          <div className="flex flex-col space-y-4">
            <NavSection
              title="Main"
              items={[
                { name: 'Home', icon: MdHome, to: '#' },
                { name: 'Chat', icon: MdChat, to: '#' },
              ]}
            />
            <NavSection
              title="Settings"
              items={[
                { name: 'Account', icon: MdPerson, to: '#' },
                { name: 'Preferences', icon: MdSettings, to: '#' },
              ]}
            />
            <NavSection
              title="Learn"
              items={[
                { name: 'Tutorials', icon: MdSchool, to: '#' },
                { name: 'Documentation', icon: MdHistory, to: '#' },
              ]}
            />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Click Handlers"
        description="Navigation items with onClick handlers instead of routes"
        code={`const navItems = [
  {
    name: 'Home',
    icon: MdHome,
    onClick: () => console.log('Home clicked')
  },
  {
    name: 'Settings',
    icon: MdSettings,
    onClick: () => console.log('Settings clicked')
  }
];

<NavSection
  title="Interactive Navigation"
  items={navItems}
/>`}
      >
        <div className="w-64 border rounded-lg overflow-hidden">
          <NavSection
            title="Interactive Navigation"
            items={[
              {
                name: 'Home',
                icon: MdHome,
                onClick: () => {},
              },
              {
                name: 'Settings',
                icon: MdSettings,
                onClick: () => {},
              },
            ]}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Custom Styling"
        description="Navigation section with custom styling"
        code={`<NavSection
  title="Styled Navigation"
  items={navItems}
  className="bg-muted/30 rounded-md"
/>`}
      >
        <div className="w-64 border rounded-lg overflow-hidden">
          <NavSection
            title="Styled Navigation"
            items={mainNavItems}
            className="bg-muted/30 rounded-md"
          />
        </div>
      </ComponentExample>
    </div>
  );
};
