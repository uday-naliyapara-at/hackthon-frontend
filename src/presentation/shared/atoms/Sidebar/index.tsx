import { forwardRef } from 'react';

import {
  SidebarGroup as ShadcnSidebarGroup,
  SidebarGroupLabel as ShadcnSidebarGroupLabel,
  SidebarMenu as ShadcnSidebarMenu,
  SidebarMenuButton as ShadcnSidebarMenuButton,
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuSub as ShadcnSidebarMenuSub,
  SidebarMenuSubButton as ShadcnSidebarMenuSubButton,
  SidebarMenuSubItem as ShadcnSidebarMenuSubItem,
} from '@/components/ui/sidebar';

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
}
export interface SidebarMenuSubProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>((props, ref) => {
  return <ShadcnSidebarGroup ref={ref} {...props} />;
});

const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>((props, ref) => {
  return <ShadcnSidebarGroupLabel ref={ref} {...props} />;
});

const SidebarMenu = forwardRef<HTMLDivElement, SidebarMenuProps>((props, ref) => {
  return <ShadcnSidebarMenu ref={ref} {...props} />;
});

const SidebarMenuItem = forwardRef<HTMLDivElement, SidebarMenuItemProps>((props, ref) => {
  return <ShadcnSidebarMenuItem ref={ref} {...props} />;
});

const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>((props, ref) => {
  return <ShadcnSidebarMenuButton ref={ref} {...props} />;
});

const SidebarMenuSub = forwardRef<HTMLDivElement, SidebarMenuSubProps>((props, ref) => {
  return <ShadcnSidebarMenuSub ref={ref} {...props} />;
});

const SidebarMenuSubItem = forwardRef<HTMLDivElement, SidebarMenuSubItemProps>((props, ref) => {
  return <ShadcnSidebarMenuSubItem ref={ref} {...props} />;
});

const SidebarMenuSubButton = forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  (props, ref) => {
    return <ShadcnSidebarMenuSubButton ref={ref} {...props} />;
  }
);

SidebarGroup.displayName = 'SidebarGroup';
SidebarGroupLabel.displayName = 'SidebarGroupLabel';
SidebarMenu.displayName = 'SidebarMenu';
SidebarMenuItem.displayName = 'SidebarMenuItem';
SidebarMenuButton.displayName = 'SidebarMenuButton';
SidebarMenuSub.displayName = 'SidebarMenuSub';
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
};
