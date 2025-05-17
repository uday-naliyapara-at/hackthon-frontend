import { forwardRef } from 'react';

import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent as ShadcnCollapsibleContent,
  CollapsibleTrigger as ShadcnCollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface CollapsibleProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnCollapsible> {}
export interface CollapsibleTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnCollapsibleTrigger> {}
export interface CollapsibleContentProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnCollapsibleContent> {}

const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>((props, ref) => {
  return <ShadcnCollapsible ref={ref} {...props} />;
});

const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>((props, ref) => {
  return <ShadcnCollapsibleTrigger ref={ref} {...props} />;
});

const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>((props, ref) => {
  return <ShadcnCollapsibleContent ref={ref} {...props} />;
});

Collapsible.displayName = 'Collapsible';
CollapsibleTrigger.displayName = 'CollapsibleTrigger';
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
