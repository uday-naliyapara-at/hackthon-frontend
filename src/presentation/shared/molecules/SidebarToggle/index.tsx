import { PiSidebarBold } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import { Button, Icon } from '@/presentation/shared/atoms';

export interface SidebarToggleProps {
  isCollapsed: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

export function SidebarToggle({
  isCollapsed,
  onClick,
  className,
  'data-testid': testId,
}: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn('hidden md:flex', className)}
      data-testid={testId}
    >
      <Icon
        icon={PiSidebarBold}
        className={cn('h-6 w-6 transition-transform', isCollapsed && 'rotate-180')}
        data-testid={isCollapsed ? 'sidebar-expand-icon' : 'sidebar-collapse-icon'}
      />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
