import React from 'react';
import { HiInformationCircle } from 'react-icons/hi';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Card } from '@/presentation/shared/atoms/Card';
import { Icon } from '@/presentation/shared/atoms/Icon';

// Define the props for the AuthImage component
const authImageProps: PropDef[] = [
  {
    name: 'src',
    type: 'string',
    required: true,
    description: 'The primary image source URL',
  },
  {
    name: 'fallbackSrc',
    type: 'string',
    description: 'Fallback image source URL to use if the primary source fails to load',
  },
  {
    name: 'alt',
    type: 'string',
    required: true,
    description: 'Alternate text description of the image for accessibility',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the image',
  },
];

export const AuthImageDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">AuthImage</h2>
        <p>
          The AuthImage component is designed for authentication screens, displaying a primary image
          with an optional fallback. It adapts responsively to different screen sizes and provides
          proper accessibility attributes.
        </p>
      </div>

      <PropsTable props={authImageProps} />

      <ComponentExample
        name="Basic AuthImage"
        description="Image component used in authentication screens with fallback and dark mode support"
        code={`import { AuthImage } from './index';

<AuthImage 
  src="/auth-background.jpg" 
  alt="Authentication background" 
/>`}
      >
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
            <div className="relative z-10 text-center p-6">
              <div className="text-xl font-medium mb-2">AuthImage Preview</div>
              <p className="text-sm text-gray-500">
                The AuthImage component is designed to show a background image on authentication
                pages. It's hidden on mobile and visible on medium screens and above.
              </p>
            </div>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="AuthImage with Fallback"
        description="AuthImage will display a fallback image if the main source fails to load"
        code={`<AuthImage 
  src="/path/to/image.jpg" 
  fallbackSrc="/fallback-image.jpg"
  alt="Auth screen image" 
/>`}
      >
        <div className="border rounded-md p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              <span className="text-xs">Primary</span>
            </div>
            <Icon icon={HiInformationCircle} className="h-5 w-5 text-gray-400" />
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              <span className="text-xs">Fallback</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            If the primary image fails to load, the component will automatically use the fallback
            image
          </p>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Dark Mode Behavior"
        description="AuthImage applies special styling in dark mode"
        code={`<AuthImage 
  src="/auth-background.jpg" 
  alt="Authentication background" 
  className="custom-filter-class"
/>`}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Light Mode</h3>
            <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-600">Normal image</span>
            </div>
          </div>
          <div className="border rounded-md p-4 bg-gray-800">
            <h3 className="font-medium mb-2 text-white">Dark Mode</h3>
            <div className="h-40 bg-gray-700 rounded flex items-center justify-center brightness-[0.2] grayscale">
              <span className="text-gray-400">Darker & grayscale</span>
            </div>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Responsive Behavior"
        description="AuthImage is hidden on mobile and visible on tablets and desktops"
        code={`// AuthImage is hidden on mobile (md:block)
<div className="grid grid-cols-1 md:grid-cols-2 h-screen">
  <div className="p-6">Login form content</div>
  <AuthImage src="/auth-background.jpg" alt="Authentication page image" />
</div>`}
      >
        <Card>
          <div className="p-4">
            <h3 className="font-medium mb-4">Responsive Layout</h3>
            <div className="flex flex-col space-y-4">
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-2">Mobile View (hidden)</h4>
                <div className="h-20 bg-white border rounded flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Form only</span>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-2">Desktop View (visible)</h4>
                <div className="h-20 grid grid-cols-2 gap-2">
                  <div className="border rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Form</span>
                  </div>
                  <div className="border rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">AuthImage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="In Authentication Layout"
        description="AuthImage used in a complete authentication page layout"
        code={`<div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
  <div className="flex flex-col justify-center p-8">
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500">Enter your credentials to sign in</p>
      </div>
      {/* Login form fields would go here */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full">Sign In</Button>
      </div>
    </div>
  </div>
  
  <AuthImage 
    src="/auth-background.jpg" 
    alt="Authentication background" 
    className="hidden md:block"
  />
</div>`}
      >
        <div className="border rounded-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-4 bg-white md:w-1/2">
              <div className="text-center mb-4">
                <h3 className="font-medium">Login Form</h3>
                <p className="text-sm text-gray-500">Form with input fields and buttons</p>
              </div>
              <div className="border rounded p-3 bg-gray-50">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-primary rounded"></div>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2 h-48 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center text-gray-500">AuthImage</div>
            </div>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
