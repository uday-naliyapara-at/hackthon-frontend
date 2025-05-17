import React, { useState } from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Button } from '@/presentation/shared/atoms/Button';
import { Label } from '@/presentation/shared/atoms/Label';

import { Input } from './index';

// Define the props for the Input component
const inputProps: PropDef[] = [
  // Custom props added by our Input component
  {
    name: 'error',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Displays input in error state with red border',
  },
  {
    name: 'helperText',
    type: 'string',
    description: 'Helper text displayed beneath the input (shown in red when error=true)',
  },
  // Common HTML input props (not exhaustive)
  {
    name: 'type',
    type: 'string',
    defaultValue: 'text',
    description: 'HTML input type attribute (text, password, email, etc.)',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder text to display when empty',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Current value of the input',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables the input',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Marks the input as required',
  },
  {
    name: 'onChange',
    type: '(e: React.ChangeEvent<HTMLInputElement>) => void',
    description: 'Called when the input value changes',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
    description: 'All other native input attributes are also supported',
  },
];

export const InputDocs: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [showError, setShowError] = useState(false);

  const validateInput = () => {
    if (errorValue.length < 3) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Input</h2>
        <p>
          Input components allow users to enter text and data. This component is a wrapper around
          the native HTML input element with additional styling and functionality. It adds support
          for error states and helper text.
        </p>
      </div>

      <PropsTable props={inputProps} />

      <ComponentExample
        name="Basic Input"
        description="Standard text input field with placeholder"
        code={`<Input placeholder="Enter text here..." />
<Input disabled placeholder="Disabled input" />`}
      >
        <div className="w-full max-w-sm space-y-4">
          <Input placeholder="Enter text here..." />
          <Input disabled placeholder="Disabled input" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Input with Label"
        description="Input field with an associated label for better accessibility"
        code={`<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="example@email.com" />
</div>`}
      >
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="example@email.com" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Interactive Input"
        description="Type in the input to see the value change"
        code={`const [inputValue, setInputValue] = useState('');

<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="interactive">Type something</Label>
    <Input 
      id="interactive" 
      value={inputValue} 
      onChange={(e) => setInputValue(e.target.value)} 
      placeholder="Type here..." 
    />
  </div>
  <div className="p-2 border rounded-md bg-muted">
    Current value: {inputValue || <span className="text-muted-foreground italic">Empty</span>}
  </div>
</div>`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interactive">Type something</Label>
            <Input
              id="interactive"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
            />
          </div>
          <div className="p-2 border rounded-md bg-muted">
            Current value:{' '}
            {inputValue || <span className="text-muted-foreground italic">Empty</span>}
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Error State"
        description="Input with validation and error messages"
        code={`const [errorValue, setErrorValue] = useState('');
const [showError, setShowError] = useState(false);
  
const validateInput = () => {
  if (errorValue.length < 3) {
    setShowError(true);
  } else {
    setShowError(false);
  }
};

<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="error-input">Username (min 3 characters)</Label>
    <Input 
      id="error-input" 
      value={errorValue} 
      onChange={(e) => setErrorValue(e.target.value)}
      error={showError}
      helperText={showError ? "Username must be at least 3 characters" : ""}
      placeholder="Enter username" 
    />
  </div>
  <Button onClick={validateInput}>Validate</Button>
</div>`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="error-input">Username (min 3 characters)</Label>
            <Input
              id="error-input"
              value={errorValue}
              onChange={(e) => setErrorValue(e.target.value)}
              error={showError}
              helperText={showError ? 'Username must be at least 3 characters' : ''}
              placeholder="Enter username"
            />
          </div>
          <Button onClick={validateInput}>Validate</Button>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Input Types"
        description="Different input types for specific data entry"
        code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="text-input">Text</Label>
    <Input id="text-input" type="text" placeholder="Text input" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="number-input">Number</Label>
    <Input id="number-input" type="number" placeholder="Number input" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="password-input">Password</Label>
    <Input id="password-input" type="password" placeholder="Password input" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="date-input">Date</Label>
    <Input id="date-input" type="date" />
  </div>
</div>`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text</Label>
            <Input id="text-input" type="text" placeholder="Text input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number-input">Number</Label>
            <Input id="number-input" type="number" placeholder="Number input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-input">Password</Label>
            <Input id="password-input" type="password" placeholder="Password input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-input">Date</Label>
            <Input id="date-input" type="date" />
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
