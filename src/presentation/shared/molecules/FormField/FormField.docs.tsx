import React, { useState } from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Button } from '@/presentation/shared/atoms/Button';

import { FormField } from './index';

// Define the props for the FormField component
const formFieldProps: PropDef[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the input element',
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Text label for the form field',
  },
  {
    name: 'type',
    type: 'string',
    defaultValue: "'text'",
    description: 'HTML input type attribute (text, email, password, etc.)',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder text to display when empty',
  },
  {
    name: 'required',
    type: 'boolean',
    description: 'Whether the input is required',
  },
  {
    name: 'error',
    type: 'boolean',
    description: 'Whether the field is in an error state',
  },
  {
    name: 'errorMessage',
    type: 'string',
    description: 'Error message to display when in error state',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Whether the input is disabled',
  },
];

export const FormFieldDocs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">FormField</h2>
        <p>
          The FormField component combines a labeled input with error handling. It provides a
          consistent layout and appearance for form inputs throughout the application and simplifies
          the process of creating accessible form fields.
        </p>
      </div>

      <PropsTable props={formFieldProps} />

      <ComponentExample
        name="Basic Form Field"
        description="Standard form field with a label"
        code={`<FormField 
  id="name" 
  label="Name" 
  placeholder="Enter your name"
/>`}
      >
        <div className="w-full max-w-sm">
          <FormField
            id="name"
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Required Form Field"
        description="Form field marked as required"
        code={`<FormField 
  id="email" 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  required
/>`}
      >
        <div className="w-full max-w-sm">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Form Field with Error"
        description="Form field in an error state with an error message"
        code={`<FormField 
  id="email-error" 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  error={true}
  errorMessage="Please enter a valid email address"
/>`}
      >
        <div className="w-full max-w-sm">
          <FormField
            id="email-error"
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={true}
            errorMessage="Please enter a valid email address"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Disabled Form Field"
        description="Form field in a disabled state"
        code={`<FormField 
  id="username" 
  label="Username" 
  placeholder="Enter username"
  disabled
  value="johndoe"
/>`}
      >
        <div className="w-full max-w-sm">
          <FormField
            id="username"
            label="Username"
            placeholder="Enter username"
            disabled
            value="johndoe"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Different Input Types"
        description="Form fields with different input types"
        code={`<div className="space-y-4">
  <FormField 
    id="text-input" 
    label="Text Input" 
    type="text" 
    placeholder="Standard text input"
  />
  <FormField 
    id="number-input" 
    label="Number Input" 
    type="number" 
    placeholder="Enter a number"
  />
  <FormField 
    id="date-input" 
    label="Date Input" 
    type="date"
  />
</div>`}
      >
        <div className="w-full max-w-sm space-y-4">
          <FormField
            id="text-input"
            label="Text Input"
            type="text"
            placeholder="Standard text input"
          />
          <FormField
            id="number-input"
            label="Number Input"
            type="number"
            placeholder="Enter a number"
          />
          <FormField id="date-input" label="Date Input" type="date" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In a Form Context"
        description="Multiple form fields in a contact form"
        code={`<form onSubmit={handleSubmit} className="space-y-4">
  <FormField 
    id="contact-name" 
    label="Name" 
    placeholder="Enter your name"
    required
  />
  <FormField 
    id="contact-email" 
    label="Email" 
    type="email" 
    placeholder="Enter your email"
    required
  />
  <FormField 
    id="contact-subject" 
    label="Subject" 
    placeholder="Enter the subject"
  />
  <div className="pt-2">
    <Button type="submit">Send Message</Button>
  </div>
</form>`}
      >
        <div className="w-full max-w-sm border p-4 rounded-md">
          <form className="space-y-4">
            <FormField id="contact-name" label="Name" placeholder="Enter your name" required />
            <FormField
              id="contact-email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />
            <FormField id="contact-subject" label="Subject" placeholder="Enter the subject" />
            <div className="pt-2">
              <Button type="button">Send Message</Button>
            </div>
          </form>
        </div>
      </ComponentExample>
    </div>
  );
};
