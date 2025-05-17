import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { Button } from '@/presentation/shared/atoms/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/shared/atoms/Card';

// Define the props for the Card component and subcomponents
const cardProps: PropDef[] = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to be rendered inside the card',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the card',
  },
];

const cardSubcomponentProps: PropDef[] = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'The content to be rendered inside the subcomponent',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the subcomponent',
  },
];

export const CardDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">Card</h2>
        <p>
          Cards are surfaces that display content and actions on a single topic. They provide a
          flexible container for organizing and presenting information.
        </p>
      </div>

      <PropsTable props={cardProps} />

      <div className="prose max-w-none dark:prose-invert my-6">
        <h3 className="text-xl font-semibold">Card Subcomponents</h3>
        <p>
          The Card component includes several subcomponents for structured layout: CardHeader,
          CardTitle, CardDescription, CardContent, and CardFooter. These subcomponents share the
          same basic props:
        </p>
      </div>

      <PropsTable props={cardSubcomponentProps} />

      <ComponentExample
        name="Basic Card"
        description="Standard card component with header, content, and footer"
        code={`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the main content area of the card. You can place any content here.</p>
  </CardContent>
  <CardFooter>
    <p className="text-sm text-muted-foreground">Footer information goes here</p>
  </CardFooter>
</Card>`}
      >
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description or subtitle</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content area of the card. You can place any content here.</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Footer information goes here</p>
          </CardFooter>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="Card with Actions"
        description="Card with header, content and footer with action buttons"
        code={`<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
    <CardDescription>Update your account preferences here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Manage your account settings and preferences.</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>`}
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your account preferences here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage your account settings and preferences.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="Interactive Card"
        description="Card with hover effects and click interactions"
        code={`<Card 
  className="hover:shadow-md transition-shadow cursor-pointer" 
  onClick={() => alert('Card clicked!')}
>
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
    <CardDescription>Click me to trigger an action</CardDescription>
  </CardHeader>
  <CardContent className="flex justify-end">
    <Button variant="ghost" size="sm">View</Button>
  </CardContent>
</Card>`}
      >
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => alert('Card clicked!')}
        >
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
            <CardDescription>Click me to trigger an action</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="ghost" size="sm">
              View
            </Button>
          </CardContent>
        </Card>
      </ComponentExample>

      <ComponentExample
        name="Card Grid Layout"
        description="Using cards in a responsive grid layout"
        code={`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>
    <CardHeader>
      <CardTitle>Card 1</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Description for card 1</p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Card 2</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Description for card 2</p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Card 3</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Description for card 3</p>
    </CardContent>
  </Card>
</div>`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Description for card 1</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Description for card 2</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Description for card 3</p>
            </CardContent>
          </Card>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Styled Cards"
        description="Cards with custom styling and borders"
        code={`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card className="overflow-hidden border-l-4 border-l-primary">
    <CardHeader>
      <CardTitle>Accent Border Card</CardTitle>
      <CardDescription>Card with a primary color accent border</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Custom styled card example</p>
    </CardContent>
  </Card>
  
  <Card className="bg-primary text-primary-foreground">
    <CardHeader>
      <CardTitle>Colored Background Card</CardTitle>
      <CardDescription>Card with a primary background color</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Another custom styled card example</p>
    </CardContent>
  </Card>
</div>`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Accent Border Card</CardTitle>
              <CardDescription>Card with a primary color accent border</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Custom styled card example</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Colored Background Card</CardTitle>
              <CardDescription>Card with a primary background color</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Another custom styled card example</p>
            </CardContent>
          </Card>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Card Without Header/Footer"
        description="Simple card with just content"
        code={`<Card>
  <CardContent className="pt-6">
    <p>A simple card with just content and no header or footer.</p>
    <p className="mt-2">This is useful for simpler UI elements that don't need the full card structure.</p>
  </CardContent>
</Card>`}
      >
        <Card>
          <CardContent className="pt-6">
            <p>A simple card with just content and no header or footer.</p>
            <p className="mt-2">
              This is useful for simpler UI elements that don't need the full card structure.
            </p>
          </CardContent>
        </Card>
      </ComponentExample>
    </div>
  );
};
