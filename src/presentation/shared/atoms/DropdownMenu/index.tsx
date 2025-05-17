import { forwardRef } from 'react';

import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuCheckboxItem as ShadcnDropdownMenuCheckboxItem,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuGroup as ShadcnDropdownMenuGroup,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuPortal as ShadcnDropdownMenuPortal,
  DropdownMenuRadioGroup as ShadcnDropdownMenuRadioGroup,
  DropdownMenuRadioItem as ShadcnDropdownMenuRadioItem,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuShortcut as ShadcnDropdownMenuShortcut,
  DropdownMenuSub as ShadcnDropdownMenuSub,
  DropdownMenuSubContent as ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger as ShadcnDropdownMenuSubTrigger,
  DropdownMenuTrigger as ShadcnDropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DropdownMenuProps = React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenu>;
export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuTrigger
>;
export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuContent
>;
export type DropdownMenuItemProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuItem
> & {
  inset?: boolean;
};
export type DropdownMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuCheckboxItem
>;
export type DropdownMenuRadioItemProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuRadioItem
>;
export type DropdownMenuLabelProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuLabel
> & {
  inset?: boolean;
};
export type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuSeparator
>;
export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuGroup>;
export type DropdownMenuPortalProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuPortal
>;
export type DropdownMenuSubProps = React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuSub>;
export type DropdownMenuSubContentProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuSubContent
>;
export type DropdownMenuSubTriggerProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuSubTrigger
> & {
  inset?: boolean;
};
export type DropdownMenuRadioGroupProps = React.ComponentPropsWithoutRef<
  typeof ShadcnDropdownMenuRadioGroup
>;

export const DropdownMenu = ShadcnDropdownMenu;
export const DropdownMenuTrigger = ShadcnDropdownMenuTrigger;
export const DropdownMenuGroup = ShadcnDropdownMenuGroup;
export const DropdownMenuPortal = ShadcnDropdownMenuPortal;
export const DropdownMenuSub = ShadcnDropdownMenuSub;
export const DropdownMenuRadioGroup = ShadcnDropdownMenuRadioGroup;

export const DropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuSubTrigger>,
  DropdownMenuSubTriggerProps
>((props, ref) => <ShadcnDropdownMenuSubTrigger ref={ref} {...props} />);
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuSubContent>,
  DropdownMenuSubContentProps
>((props, ref) => <ShadcnDropdownMenuSubContent ref={ref} {...props} />);
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuContent>,
  DropdownMenuContentProps
>((props, ref) => <ShadcnDropdownMenuContent ref={ref} {...props} />);
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuItem>,
  DropdownMenuItemProps
>((props, ref) => <ShadcnDropdownMenuItem ref={ref} {...props} />);
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuCheckboxItem>,
  DropdownMenuCheckboxItemProps
>((props, ref) => <ShadcnDropdownMenuCheckboxItem ref={ref} {...props} />);
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuRadioItem>,
  DropdownMenuRadioItemProps
>((props, ref) => <ShadcnDropdownMenuRadioItem ref={ref} {...props} />);
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuLabel>,
  DropdownMenuLabelProps
>((props, ref) => <ShadcnDropdownMenuLabel ref={ref} {...props} />);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenuSeparator>,
  DropdownMenuSeparatorProps
>((props, ref) => <ShadcnDropdownMenuSeparator ref={ref} {...props} />);
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return <ShadcnDropdownMenuShortcut className={className} {...props} />;
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
