import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Input } from '@/presentation/shared/atoms/Input';

import { Label } from './index';

// Define the props for the Label component
const labelProps: PropDef[] = [
  // Custom props added by our Label component
  {
    name: 'error',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Displays label text in error state (red color)',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description: 'When true, renders a red asterisk (*) next to the label text',
  },
  // Standard label props
  {
    name: 'htmlFor',
    type: 'string',
    description: 'The ID of the form element the label is associated with',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to be displayed within the label',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the label',
  },
  {
    name: '...rest',
    type: 'LabelHTMLAttributes<HTMLLabelElement>',
    description: 'All other native label attributes are also supported',
  },
];

export const LabelDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Label</h2>
        <p>
          The Label component is used to create accessible form labels that are associated with
          input controls. Labels help users understand what information is requested in form fields.
          This component extends the standard HTML label with support for error states and required
          field indicators.
        </p>
      </div>

      <PropsTable props={labelProps} />

      <ComponentExample
        name="Basic Label"
        description="Standard label component for form elements"
        code={`<Label htmlFor="name">Name</Label>
<Input id="name" />`}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Required Label"
        description="Label with a required indicator"
        code={`<Label htmlFor="email" required>Email address</Label>
<Input id="email" required />`}
      >
        <div className="space-y-2">
          <Label htmlFor="email" required>
            Email address
          </Label>
          <Input id="email" required />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Error Label"
        description="Label in error state"
        code={`<Label htmlFor="invalid" error>Invalid field</Label>
<Input id="invalid" error />`}
      >
        <div className="space-y-2">
          <Label htmlFor="invalid" error>
            Invalid field
          </Label>
          <Input id="invalid" error />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Custom Styled Label"
        description="Label with custom styling"
        code={`<Label htmlFor="custom" className="text-primary font-bold">Custom Label</Label>
<Input id="custom" />`}
      >
        <div className="space-y-2">
          <Label htmlFor="custom" className="text-primary font-bold">
            Custom Label
          </Label>
          <Input id="custom" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Label with Description"
        description="Label with additional description text"
        code={`<div>
  <Label htmlFor="password">Password</Label>
  <p className="text-xs text-gray-500 mb-2">
    Must be at least 8 characters and include a number
  </p>
  <Input id="password" type="password" />
</div>`}
      >
        <div>
          <Label htmlFor="password">Password</Label>
          <p className="text-xs text-gray-500 mb-2">
            Must be at least 8 characters and include a number
          </p>
          <Input id="password" type="password" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Form Group with Multiple Labels"
        description="Multiple labels organized in a form group"
        code={`<fieldset className="border rounded-md p-4">
  <legend className="text-sm font-medium px-2">Personal Information</legend>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="firstName">First Name</Label>
      <Input id="firstName" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="lastName">Last Name</Label>
      <Input id="lastName" />
    </div>
  </div>
</fieldset>`}
      >
        <fieldset className="border rounded-md p-4">
          <legend className="text-sm font-medium px-2">Personal Information</legend>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" />
            </div>
          </div>
        </fieldset>
      </ComponentExample>
    </div>
  );
};
