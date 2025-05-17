import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { LoadingSpinner } from './index';

// Define the props for the LoadingSpinner component
const spinnerProps: PropDef[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'The size of the spinner',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the spinner',
  },
];

export const LoadingSpinnerDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">LoadingSpinner</h2>
        <p>
          The LoadingSpinner component indicates that content is being loaded or an action is in
          progress. It provides visual feedback to users during asynchronous operations. The
          component uses a rotating arrow icon from the Heroicons library.
        </p>
      </div>

      <PropsTable props={spinnerProps} />

      <ComponentExample
        name="Default Loading Spinner"
        description="Standard loading spinner with default appearance"
        code={`<LoadingSpinner />`}
      >
        <LoadingSpinner />
      </ComponentExample>

      <ComponentExample
        name="Spinner Sizes"
        description="Loading spinners available in different sizes"
        code={`<div className="flex items-end space-x-4">
  <div className="flex flex-col items-center">
    <LoadingSpinner size="sm" />
    <span className="text-xs mt-2">sm</span>
  </div>
  <div className="flex flex-col items-center">
    <LoadingSpinner size="md" />
    <span className="text-xs mt-2">md</span>
  </div>
  <div className="flex flex-col items-center">
    <LoadingSpinner size="lg" />
    <span className="text-xs mt-2">lg</span>
  </div>
</div>`}
      >
        <div className="flex items-end space-x-4">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="sm" />
            <span className="text-xs mt-2">sm</span>
          </div>
          <div className="flex flex-col items-center">
            <LoadingSpinner size="md" />
            <span className="text-xs mt-2">md</span>
          </div>
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <span className="text-xs mt-2">lg</span>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Styled Spinners"
        description="Spinners with custom styling through className"
        code={`<div className="flex space-x-4">
  <div className="flex flex-col items-center">
    <LoadingSpinner className="text-primary" />
    <span className="text-xs mt-2">primary</span>
  </div>
  <div className="flex flex-col items-center">
    <LoadingSpinner className="text-secondary" />
    <span className="text-xs mt-2">secondary</span>
  </div>
  <div className="p-4 bg-gray-800 rounded-md">
    <div className="flex flex-col items-center">
      <LoadingSpinner className="text-white" />
      <span className="text-xs mt-2 text-white">white</span>
    </div>
  </div>
</div>`}
      >
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <LoadingSpinner className="text-primary" />
            <span className="text-xs mt-2">primary</span>
          </div>
          <div className="flex flex-col items-center">
            <LoadingSpinner className="text-secondary" />
            <span className="text-xs mt-2">secondary</span>
          </div>
          <div className="p-4 bg-gray-800 rounded-md">
            <div className="flex flex-col items-center">
              <LoadingSpinner className="text-white" />
              <span className="text-xs mt-2 text-white">white</span>
            </div>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Spinner with Text"
        description="Loading spinner accompanied by descriptive text"
        code={`<div className="flex flex-col items-center space-y-2">
  <LoadingSpinner size="lg" />
  <p className="text-sm text-gray-500">Loading content...</p>
</div>`}
      >
        <div className="flex flex-col items-center space-y-2">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500">Loading content...</p>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Button Loading State"
        description="Spinner used in a button's loading state"
        code={`<button 
  className="inline-flex items-center justify-center gap-2 
    rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground 
    hover:bg-primary/90"
>
  <LoadingSpinner size="sm" className="text-primary-foreground" />
  <span>Processing...</span>
</button>`}
      >
        <button
          className="inline-flex items-center justify-center gap-2 
            rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground 
            hover:bg-primary/90"
        >
          <LoadingSpinner size="sm" className="text-primary-foreground" />
          <span>Processing...</span>
        </button>
      </ComponentExample>

      <ComponentExample
        name="Full Page Loading"
        description="Loading spinner centered on a page or section"
        code={`<div className="relative h-40 w-full border border-dashed rounded-md flex items-center justify-center">
  <div className="flex flex-col items-center">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-muted-foreground">Loading application...</p>
  </div>
</div>`}
      >
        <div className="relative h-40 w-full border border-dashed rounded-md flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading application...</p>
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
