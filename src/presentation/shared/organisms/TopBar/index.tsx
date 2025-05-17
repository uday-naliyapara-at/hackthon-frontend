import { cn } from '@/lib/utils';
import { type User } from '@/domain/models/user/types';
import { UserCard } from '../../molecules/UserCard';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { HiPlus, HiUser, HiArrowRightOnRectangle, HiTrophy } from 'react-icons/hi2';
import { UserAvatar } from '../../atoms/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../atoms/DropdownMenu';
import { Link } from '@/presentation/shared/atoms/Link';

export interface TopBarProps {
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
  className?: string;
  user: User;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export function TopBar({ 
  className, 
  user, 
  onLogout, 
  onProfileClick 
}: TopBarProps) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    onLogout?.();
  };

  const handleProfileClick = () => {
    onProfileClick?.();
  };

  return (
    <header className={cn('flex items-center justify-between h-[60px] px-[220px] border-b', className)}>
     
      <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        <Link to="/" className="flex items-center gap-2 hover:no-underline">
          <Icon icon={HiTrophy} className="w-7 h-7 text-blue-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            KudosWall
          </span>
        </Link>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <UserAvatar user={user} size="md" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white border border-gray-200 shadow-lg rounded-md"
            >
              <DropdownMenuItem 
                onClick={handleProfileClick} 
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
              >
                <Icon icon={HiUser} className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
              >
                <Icon icon={HiArrowRightOnRectangle} className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
