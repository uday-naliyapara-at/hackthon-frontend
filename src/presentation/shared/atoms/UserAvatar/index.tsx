import { type User } from '@/domain/models/user/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface UserAvatarProps {
  /** User object containing profile information */
  user: User;
  /** Size of the avatar */
  size?: 'sm' | 'md' | 'lg';
  /** Optional className for styling overrides */
  className?: string;
}

/**
 * UserAvatar component that displays a user's avatar image with fallback
 */
export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
} 