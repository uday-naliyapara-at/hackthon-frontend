import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { Button } from './index';

// Define the props for the Button component
const buttonProps: PropDef[] = [
  {
    name: 'variant',
    type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
    defaultValue: "'default'",
    description: 'The visual style of the button',
  },
  {
    name: 'size',
    type: "'default' | 'sm' | 'lg' | 'icon'",
    defaultValue: "'default'",
    description: 'The size of the button',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, the component will render its child directly, applying button properties to it',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the button is disabled',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to be displayed within the button',
  },
];

export const ButtonDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Button</h2>
        <p>
          The Button component is a versatile interactive element used for triggering actions. It
          supports various styles, sizes, and states to fit different UI contexts and needs.
        </p>
      </div>

      <PropsTable props={buttonProps} />

      <ComponentExample
        name="Basic Button"
        description="Default button with standard styling"
        code={`<Button>Click me</Button>`}
      >
        <Button>Click me</Button>
      </ComponentExample>

      <ComponentExample
        name="Button Variants"
        description="Different visual styles for various contexts"
        code={`<div className="flex flex-wrap gap-4">
  <Button variant="default">Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>`}
      >
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Button Sizes"
        description="Different size options to fit various layouts"
        code={`<div className="flex flex-wrap items-center gap-4">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
</div>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Disabled State"
        description="Button in disabled state - not clickable"
        code={`<div className="flex flex-wrap gap-4">
  <Button disabled>Disabled Button</Button>
  <Button disabled variant="outline">Disabled Outline</Button>
</div>`}
      >
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Button</Button>
          <Button disabled variant="outline">
            Disabled Outline
          </Button>
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Icon"
        description="Button with an icon alongside text"
        code={`<Button className="flex items-center gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
  Continue
</Button>`}
      >
        <Button className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
          Continue
        </Button>
      </ComponentExample>

      <ComponentExample
        name="Custom Styling"
        description="Button with custom styling applied"
        code={`<Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
  Gradient Button
</Button>`}
      >
        <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
          Gradient Button
        </Button>
      </ComponentExample>

      <ComponentExample
        name="Loading State"
        description="Button showing a loading spinner"
        code={`<Button className="flex items-center gap-2" disabled>
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Processing...
</Button>`}
      >
        <Button className="flex items-center gap-2" disabled>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </Button>
      </ComponentExample>
    </div>
  );
};
