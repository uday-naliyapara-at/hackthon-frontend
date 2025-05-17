import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { SocialIcon } from './index';

// Define the props for the SocialIcon component
const socialIconProps: PropDef[] = [
  {
    name: 'provider',
    type: "'apple' | 'google' | 'meta'",
    required: true,
    description: 'The social provider the icon represents',
  },
  {
    name: 'size',
    type: 'string | number',
    defaultValue: '20',
    description: 'Size of the social icon',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the icon',
  },
  {
    name: 'data-testid',
    type: 'string',
    description: 'Test ID for testing purposes',
  },
];

export const SocialIconDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">SocialIcon</h2>
        <p>
          The SocialIcon component displays icons for various social login providers including
          Apple, Google, and Meta (Facebook). It provides consistent branding for social
          authentication throughout the application.
        </p>
      </div>

      <PropsTable props={socialIconProps} />

      <ComponentExample
        name="Basic Social Icons"
        description="Icons for the supported social providers"
        code={`import { SocialIcon } from '@/presentation/shared/atoms/SocialIcon';

<div className="flex space-x-4">
  <SocialIcon provider="apple" />
  <SocialIcon provider="google" />
  <SocialIcon provider="meta" />
</div>`}
      >
        <div className="flex space-x-4 justify-center">
          <SocialIcon provider="apple" />
          <SocialIcon provider="google" />
          <SocialIcon provider="meta" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Icon Sizes"
        description="Social icons in different sizes"
        code={`<div className="flex items-center space-x-4">
  <SocialIcon provider="apple" size={16} />
  <SocialIcon provider="apple" size={24} />
  <SocialIcon provider="apple" size={32} />
</div>`}
      >
        <div className="flex items-center space-x-4 justify-center">
          <SocialIcon provider="apple" size={16} />
          <SocialIcon provider="apple" size={24} />
          <SocialIcon provider="apple" size={32} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Custom Styling"
        description="Social icons with custom CSS classes"
        code={`<div className="flex space-x-4">
  <SocialIcon provider="google" className="text-red-500" />
  <SocialIcon provider="meta" className="text-blue-500" />
  <SocialIcon provider="apple" className="text-gray-800 dark:text-white" />
</div>`}
      >
        <div className="flex space-x-4 justify-center">
          <SocialIcon provider="google" className="text-red-500" />
          <SocialIcon provider="meta" className="text-blue-500" />
          <SocialIcon provider="apple" className="text-gray-800 dark:text-white" />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Social Login Buttons"
        description="Using social icons within login buttons"
        code={`<div className="space-y-2">
  <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
    <SocialIcon provider="google" />
    <span>Continue with Google</span>
  </button>
  
  <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
    <SocialIcon provider="apple" />
    <span>Continue with Apple</span>
  </button>
  
  <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
    <SocialIcon provider="meta" />
    <span>Continue with Facebook</span>
  </button>
</div>`}
      >
        <div className="space-y-2">
          <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
            <SocialIcon provider="google" />
            <span>Continue with Google</span>
          </button>

          <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
            <SocialIcon provider="apple" />
            <span>Continue with Apple</span>
          </button>

          <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
            <SocialIcon provider="meta" />
            <span>Continue with Facebook</span>
          </button>
        </div>
      </ComponentExample>
    </div>
  );
};
