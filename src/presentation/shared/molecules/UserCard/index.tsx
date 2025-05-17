'use client';

import { HiChevronUpDown } from 'react-icons/hi2';

import { type User } from '@/domain/models/user/types';
import { cn } from '@/lib/utils';
import { Icon } from '@/presentation/shared/atoms/Icon';
// import { UserAvatar } from '@/presentation/shared/atoms/UserAvatar';

interface UserCardProps {
  /** User object containing profile information */
  user: User;
  /** Whether to show dropdown indicator */
  showDropdownIndicator?: boolean;
  /** Optional className for styling overrides */
  className?: string;
}

/**
 * UserCard component that displays user avatar and basic information
 */
export function UserCard({ user, showDropdownIndicator = false, className }: UserCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md p-2 transition-all duration-150',
        'hover:bg-accent/80 hover:shadow-sm active:bg-accent',
        'data-[state=open]:bg-accent',
        className
      )}
    >
      {/* <UserAvatar user={user} size="sm" /> */}
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {user.firstName} {user.lastName}
        </span>
        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
      </div>
      {showDropdownIndicator && (
        <Icon
          icon={HiChevronUpDown}
          className="ml-auto size-4 text-muted-foreground transition-transform duration-150 data-[state=open]:rotate-180"
          data-testid="dropdown-indicator"
        />
      )}
    </div>
  );
}

export type { UserCardProps };
