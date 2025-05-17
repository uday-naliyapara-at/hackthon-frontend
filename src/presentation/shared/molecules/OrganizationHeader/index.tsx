import { HiDotsHorizontal } from 'react-icons/hi';

import { cn } from '@/lib/utils';
import { Button, Icon } from '@/presentation/shared/atoms';

export interface OrganizationHeaderProps {
  name: string;
  type: string;
  isCollapsed?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

export function OrganizationHeader({
  name,
  type,
  isCollapsed = false,
  onMenuClick,
  className,
}: OrganizationHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center h-[60px] px-4 border-b',
        isCollapsed ? 'justify-center' : 'justify-between',
        className
      )}
    >
      <div className={cn('flex items-center gap-3', isCollapsed && 'gap-0')}>
        <div className="bg-foreground text-background w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
          {name.charAt(0)}
        </div>
        {!isCollapsed && (
          <div>
            <h2 className="font-semibold">{name}</h2>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onMenuClick}>
          <Icon icon={HiDotsHorizontal} className="h-4 w-4" />
          <span className="sr-only">Organization menu</span>
        </Button>
      )}
    </div>
  );
}
