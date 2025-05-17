import React, { useState } from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Button } from '@/presentation/shared/atoms/Button';

import { PasswordField } from './index';

// Define the props for the PasswordField component
const passwordFieldProps: PropDef[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the password input',
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Text label for the password field',
  },
  {
    name: 'showToggle',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to show the password visibility toggle',
  },
  {
    name: 'forgotPasswordUrl',
    type: 'string',
    defaultValue: "'#'",
    description: 'URL for the forgot password link',
  },
  {
    name: 'showForgotPassword',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to show the forgot password link',
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
    name: 'disabled',
    type: 'boolean',
    description: 'Whether the input is disabled',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the input',
  },
];

export const PasswordFieldDocs: React.FC = () => {
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">PasswordField</h2>
        <p>
          The PasswordField component is a specialized input for password entry that includes a
          toggle for password visibility and an optional "forgot password" link. It's built on top
          of the FormField component and provides a consistent user experience for password input
          across the application.
        </p>
      </div>

      <PropsTable props={passwordFieldProps} />

      <ComponentExample
        name="Basic Password Field"
        description="Standard password field with visibility toggle"
        code={`<PasswordField 
  id="password" 
  label="Password" 
  placeholder="Enter your password"
/>`}
      >
        <div className="w-full max-w-sm">
          <PasswordField
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Password Field with Error"
        description="Password field displaying an error state"
        code={`<PasswordField 
  id="password-error" 
  label="Password" 
  placeholder="Enter your password"
  error={true}
  errorMessage="Password must be at least 8 characters"
/>`}
      >
        <div className="w-full max-w-sm">
          <PasswordField
            id="password-error"
            label="Password"
            placeholder="Enter your password"
            error={true}
            errorMessage="Password must be at least 8 characters"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Without Forgot Password Link"
        description="Password field without the forgot password link"
        code={`<PasswordField 
  id="password-no-forgot" 
  label="Password" 
  placeholder="Enter your password"
  showForgotPassword={false}
/>`}
      >
        <div className="w-full max-w-sm">
          <PasswordField
            id="password-no-forgot"
            label="Password"
            placeholder="Enter your password"
            showForgotPassword={false}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Without Visibility Toggle"
        description="Password field without the visibility toggle button"
        code={`<PasswordField 
  id="password-no-toggle" 
  label="Password" 
  placeholder="Enter your password"
  showToggle={false}
/>`}
      >
        <div className="w-full max-w-sm">
          <PasswordField
            id="password-no-toggle"
            label="Password"
            placeholder="Enter your password"
            showToggle={false}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Disabled Password Field"
        description="Password field in a disabled state"
        code={`<PasswordField 
  id="password-disabled" 
  label="Password" 
  placeholder="Enter your password"
  disabled
/>`}
      >
        <div className="w-full max-w-sm">
          <PasswordField
            id="password-disabled"
            label="Password"
            placeholder="Enter your password"
            disabled
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="In a Form Context"
        description="Password field used in a login form"
        code={`<form onSubmit={handleSubmit} className="space-y-4">
  <FormField 
    id="email" 
    label="Email" 
    type="email" 
    placeholder="Enter your email"
    required
  />
  <PasswordField 
    id="password-form" 
    label="Password" 
    placeholder="Enter your password"
    required
  />
  <Button type="submit" className="w-full">Sign In</Button>
</form>`}
      >
        <div className="w-full max-w-sm space-y-4 border p-4 rounded-md">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <PasswordField id="password-form" label="Password" placeholder="Enter your password" />
          <Button className="w-full">Sign In</Button>
        </div>
      </ComponentExample>
    </div>
  );
};
