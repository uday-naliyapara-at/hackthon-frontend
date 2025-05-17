import { cn } from '@/lib/utils';
import { type User } from '@/domain/models/user/types';
import { UserCard } from '../../molecules/UserCard';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { HiPlus } from 'react-icons/hi2';
import { UserAvatar } from '../../atoms/UserAvatar';

export interface TopBarProps {
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
  className?: string;
  user: User;
}

export function TopBar({ className, user }: TopBarProps) {
  return (
    <header className={cn('flex items-center justify-between h-[60px] px-[200px] border-b', className)}>
      <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        KudosWall
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <Button variant="default" className="flex items-center gap-2">
            <Icon icon={HiPlus} className="w-5 h-5" />
            Give Kudos
          </Button>
          <UserAvatar user={user} size="md" />
        </div>
      </div>
    </header>
  );
}
