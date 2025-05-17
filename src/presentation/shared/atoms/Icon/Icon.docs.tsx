import React from 'react';
import {
  HiArrowRight,
  HiBell,
  HiCalendar,
  HiCheck,
  HiCog,
  HiExclamation,
  HiHome,
  HiInformationCircle,
  HiUser,
} from 'react-icons/hi';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { Icon } from './index';

// Define the props for the Icon component
const iconProps: PropDef[] = [
  {
    name: 'icon',
    type: 'IconType',
    required: true,
    description: 'The React icon component to render (from react-icons or similar libraries)',
  },
  {
    name: 'size',
    type: 'number',
    description: 'Icon size in pixels (applied to width and height)',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Icon color (CSS color value)',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the icon',
  },
  {
    name: 'data-testid',
    type: 'string',
    description: 'Test ID for component testing',
  },
  {
    name: '...rest',
    type: 'IconBaseProps',
    description: 'All other props from react-icons IconBaseProps (title, style, etc.)',
  },
];

export const IconDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Icon</h2>
        <p>
          The Icon component is a wrapper around icon libraries like react-icons, providing
          consistent sizing and styling for icons throughout the application. It handles rendering
          the icon inside a span element and forwarding refs appropriately.
        </p>
      </div>

      <PropsTable props={iconProps} />

      <ComponentExample
        name="Basic Icons"
        description="Common icons used throughout the application"
        code={`import { 
  HiHome, 
  HiCog, 
  HiUser, 
  HiBell 
} from 'react-icons/hi';

<div className="flex space-x-4">
  <Icon icon={HiHome} />
  <Icon icon={HiCog} />
  <Icon icon={HiUser} />
  <Icon icon={HiBell} />
</div>`}
      >
        <div className="flex space-x-4">
          <Icon icon={HiHome} />
          <Icon icon={HiCog} />
          <Icon icon={HiUser} />
          <Icon icon={HiBell} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Icon Sizes"
        description="Icons with different size properties"
        code={`import { HiArrowRight } from 'react-icons/hi';

<div className="flex items-end space-x-4">
  <div className="flex flex-col items-center">
    <Icon icon={HiArrowRight} className="h-4 w-4" />
    <span className="text-xs mt-2">Small</span>
  </div>
  <div className="flex flex-col items-center">
    <Icon icon={HiArrowRight} className="h-6 w-6" />
    <span className="text-xs mt-2">Medium</span>
  </div>
  <div className="flex flex-col items-center">
    <Icon icon={HiArrowRight} className="h-8 w-8" />
    <span className="text-xs mt-2">Large</span>
  </div>
  <div className="flex flex-col items-center">
    <Icon icon={HiArrowRight} className="h-12 w-12" />
    <span className="text-xs mt-2">X-Large</span>
  </div>
</div>`}
      >
        <div className="flex items-end space-x-4">
          <div className="flex flex-col items-center">
            <Icon icon={HiArrowRight} className="h-4 w-4" />
            <span className="text-xs mt-2">Small</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={HiArrowRight} className="h-6 w-6" />
            <span className="text-xs mt-2">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={HiArrowRight} className="h-8 w-8" />
            <span className="text-xs mt-2">Large</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon={HiArrowRight} className="h-12 w-12" />
            <span className="text-xs mt-2">X-Large</span>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Colored Icons"
        description="Icons with different color styling"
        code={`import { HiCheck, HiExclamation, HiInformationCircle } from 'react-icons/hi';

<div className="flex space-x-4">
  <Icon icon={HiCheck} className="h-6 w-6 text-green-500" />
  <Icon icon={HiExclamation} className="h-6 w-6 text-amber-500" />
  <Icon icon={HiInformationCircle} className="h-6 w-6 text-blue-500" />
  <Icon icon={HiExclamation} className="h-6 w-6 text-red-500" />
</div>`}
      >
        <div className="flex space-x-4">
          <Icon icon={HiCheck} className="h-6 w-6 text-green-500" />
          <Icon icon={HiExclamation} className="h-6 w-6 text-amber-500" />
          <Icon icon={HiInformationCircle} className="h-6 w-6 text-blue-500" />
          <Icon icon={HiExclamation} className="h-6 w-6 text-red-500" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Icons with Background"
        description="Icons with background styling"
        code={`import { HiBell, HiCog } from 'react-icons/hi';

<div className="flex space-x-4">
  <div className="p-2 bg-primary/10 rounded-full">
    <Icon icon={HiBell} className="h-5 w-5 text-primary" />
  </div>
  <div className="p-2 bg-secondary/10 rounded-full">
    <Icon icon={HiCog} className="h-5 w-5 text-secondary" />
  </div>
</div>`}
      >
        <div className="flex space-x-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon icon={HiBell} className="h-5 w-5 text-primary" />
          </div>
          <div className="p-2 bg-secondary/10 rounded-full">
            <Icon icon={HiCog} className="h-5 w-5 text-secondary" />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Icons in UI Elements"
        description="Icons used in common UI patterns"
        code={`import { HiCalendar, HiInformationCircle } from 'react-icons/hi';

<div className="space-y-4">
  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground">
    <Icon icon={HiCalendar} className="h-4 w-4" />
    <span>Schedule</span>
  </button>
  
  <div className="flex items-center gap-2 p-3 border rounded-md bg-blue-50 text-blue-800">
    <Icon icon={HiInformationCircle} className="h-5 w-5 flex-shrink-0" />
    <p className="text-sm">This is an informational message with an icon.</p>
  </div>
</div>`}
      >
        <div className="space-y-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground">
            <Icon icon={HiCalendar} className="h-4 w-4" />
            <span>Schedule</span>
          </button>

          <div className="flex items-center gap-2 p-3 border rounded-md bg-blue-50 text-blue-800">
            <Icon icon={HiInformationCircle} className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">This is an informational message with an icon.</p>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
