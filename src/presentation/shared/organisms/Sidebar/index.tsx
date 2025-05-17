'use client';

import { type User } from '@/domain/models/user/types';
import { cn } from '@/lib/utils';

import { Navigation } from '../Navigation';
import { UserNavigation } from '../UserNavigation';

export interface SidebarProps {
  isCollapsed?: boolean;
  className?: string;
  user: User;
  onLogout?: () => void;
}

export function Sidebar({ isCollapsed = false, className, user, onLogout }: SidebarProps) {
  return (
    <div
      className={cn(
        'flex hidden h-full flex-col border-r bg-sidebar transition-[width] duration-300 md:block',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
      role="complementary"
      aria-label="Desktop navigation"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <Navigation isCollapsed={isCollapsed} user={user} />
        </div>
        <div className="flex-shrink-0 border-t border-border/50 bg-sidebar/50 p-2">
          <UserNavigation user={user} onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}
