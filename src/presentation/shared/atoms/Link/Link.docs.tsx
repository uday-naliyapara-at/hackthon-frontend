import React from 'react';
import { HiArrowRight } from 'react-icons/hi';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Icon } from '@/presentation/shared/atoms/Icon';

import { Link } from './index';

// Define the props for the Link component
const linkProps: PropDef[] = [
  {
    name: 'to',
    type: 'string',
    required: true,
    description: 'URL the link points to (react-router-dom link "to" prop)',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to be displayed within the link',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the link',
  },
  {
    name: 'variant',
    type: "'default' | 'muted' | 'error'",
    defaultValue: "'default'",
    description: 'The visual style of the link',
  },
  {
    name: 'target',
    type: 'string',
    description: 'Where to open the linked document, e.g., "_blank" for a new tab',
  },
  {
    name: 'rel',
    type: 'string',
    description: 'Relationship between the current document and the linked document',
  },
];

export const LinkDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Link</h2>
        <p>
          The Link component is used for navigation between pages or to external resources. It
          extends the react-router-dom Link component with additional styling and functionality.
        </p>
      </div>

      <PropsTable props={linkProps} />

      <ComponentExample
        name="Basic Link"
        description="Standard link with default styling"
        code={`<Link to="/example">Default Link</Link>`}
      >
        <Link to="/example">Default Link</Link>
      </ComponentExample>

      <ComponentExample
        name="Link Variants"
        description="Links with different visual styles"
        code={`<div className="space-y-2">
  <div><Link to="/example" variant="default">Default Link</Link></div>
  <div><Link to="/example" variant="muted">Muted Link</Link></div>
  <div><Link to="/example" variant="error">Error Link</Link></div>
</div>`}
      >
        <div className="space-y-2">
          <div>
            <Link to="/example" variant="default">
              Default Link
            </Link>
          </div>
          <div>
            <Link to="/example" variant="muted">
              Muted Link
            </Link>
          </div>
          <div>
            <Link to="/example" variant="error">
              Error Link
            </Link>
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="External Link"
        description="Link that opens in a new tab (using native HTML attributes)"
        code={`<Link to="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit External Site
</Link>`}
      >
        <Link to="https://example.com" target="_blank" rel="noopener noreferrer">
          Visit External Site
        </Link>
      </ComponentExample>

      <ComponentExample
        name="Custom Styled Link"
        description="Link with custom styling applied via className"
        code={`<Link 
  to="/example" 
  className="font-semibold text-primary hover:text-primary/80 underline decoration-2 underline-offset-4"
>
  Custom Styled Link
</Link>`}
      >
        <Link
          to="/example"
          className="font-semibold text-primary hover:text-primary/80 underline decoration-2 underline-offset-4"
        >
          Custom Styled Link
        </Link>
      </ComponentExample>

      <ComponentExample
        name="Link with Icon"
        description="Link with an accompanying icon"
        code={`<Link to="/example" className="inline-flex items-center gap-1 group">
  Read More
  <Icon 
    icon={HiArrowRight} 
    className="h-4 w-4 transition-transform group-hover:translate-x-1" 
  />
</Link>`}
      >
        <Link to="/example" className="inline-flex items-center gap-1 group">
          Read More
          <Icon
            icon={HiArrowRight}
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </ComponentExample>

      <ComponentExample
        name="Links in Text"
        description="Links embedded within paragraph text"
        code={`<p className="text-gray-700 dark:text-gray-300">
  This is a paragraph with an {" "}
  <Link to="/example">embedded link</Link>
  {" "} in the middle of the text, which should maintain proper text flow
  and styling within the context of the surrounding content.
</p>`}
      >
        <p className="text-gray-700 dark:text-gray-300">
          This is a paragraph with an <Link to="/example">embedded link</Link> in the middle of the
          text, which should maintain proper text flow and styling within the context of the
          surrounding content.
        </p>
      </ComponentExample>

      <ComponentExample
        name="Active Link State"
        description="Link that shows active state (through react-router-dom's activeClassName functionality)"
        code={`// This would typically be handled by react-router-dom
// shown here for demonstration purposes
<Link 
  to="/current-page" 
  className="font-medium"
  style={{ textDecoration: 'underline' }} // Simulating active state
>
  Current Page Link
</Link>`}
      >
        <Link to="/current-page" className="font-medium" style={{ textDecoration: 'underline' }}>
          Current Page Link
        </Link>
      </ComponentExample>
    </div>
  );
};
