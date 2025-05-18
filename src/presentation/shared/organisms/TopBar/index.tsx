import { cn } from '@/lib/utils';
import { type User } from '@/domain/models/user/types';
import { Icon } from '../../atoms/Icon';
import {  HiUser, HiArrowRightOnRectangle, HiTrophy, HiChartBar, HiUserGroup } from 'react-icons/hi2';
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
}

export function TopBar({ 
  className, 
  user, 
  onLogout
}: TopBarProps) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    onLogout?.();
  };

  const gradientStyle = {
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '200% auto',
    animation: 'gradient 3s ease infinite'
  };

  return (
    <header className={cn('flex items-center justify-between h-[60px] px-[220px] border-b', className)}>
     
      <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        <Link to="/" className="flex items-center gap-2 hover:no-underline">
          <Icon icon={HiTrophy} className="w-7 h-7 text-blue-500" />
          <span className="text-2xl font-bold" style={gradientStyle}>KudosWall</span>
        </Link>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer flex items-center gap-2">
                <UserAvatar user={user} size="lg"  className="border-2 border-blue-500"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white border border-gray-200 shadow-lg rounded-md"
            >
              <DropdownMenuItem asChild>
                <Link 
                  to="/profile" 
                  className="flex items-center w-full cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                >
                  <Icon icon={HiUser} className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/analytics" 
                  className="flex items-center w-full cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                >
                  <Icon icon={HiChartBar} className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Link>
              </DropdownMenuItem>
              {user.role === 'ADMIN' && (
                <DropdownMenuItem asChild>
                  <Link 
                    to="/admin/users" 
                    className="flex items-center w-full cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                  >
                    <Icon icon={HiUserGroup} className="w-4 h-4 mr-2" />
                    User Management
                  </Link>
                </DropdownMenuItem>
              )}
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
