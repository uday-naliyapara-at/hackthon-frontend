import { cn } from '@/lib/utils';
// import { SidebarToggle, ThemeToggle } from '@/presentation/shared/molecules';

export interface TopBarProps {
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <header className={cn('flex items-center justify-between h-[60px] px-12 border-b', className)}>
      <div className="flex items-center gap-2">
        KudosWall
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
      </div>
    </header>
  );
}
