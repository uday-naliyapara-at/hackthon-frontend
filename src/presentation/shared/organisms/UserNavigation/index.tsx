'use client';

import {
  HiArrowRightOnRectangle,
  HiBell,
  HiCheckBadge,
  HiCreditCard,
  HiSparkles,
} from 'react-icons/hi2';

import { type User } from '@/domain/models/user/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/shared/atoms/DropdownMenu';
import { SidebarMenu, SidebarMenuItem } from '@/presentation/shared/atoms/Sidebar';
import { UserCard } from '@/presentation/shared/molecules/UserCard';

interface UserNavigationProps {
  /** User object containing profile information */
  user: User;
  /** Callback for logout action */
  onLogout?: () => void;
  /** Whether the navigation is in mobile view */
  isMobile?: boolean;
}

/**
 * UserNavigation component that displays user card with dropdown menu
 */
export function UserNavigation({ user, onLogout, isMobile = false }: UserNavigationProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full cursor-pointer">
              <UserCard
                user={user}
                showDropdownIndicator
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0">
              <UserCard user={user} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HiSparkles className="mr-2 size-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HiCheckBadge className="mr-2 size-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HiCreditCard className="mr-2 size-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HiBell className="mr-2 size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <HiArrowRightOnRectangle className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export type { UserNavigationProps };
