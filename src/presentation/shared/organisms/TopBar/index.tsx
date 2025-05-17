import { cn } from '@/lib/utils';
// import { SidebarToggle, ThemeToggle } from '@/presentation/shared/molecules';

export interface TopBarProps {
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <header className={cn('flex items-center justify-between h-[60px] px-4 border-b', className)}>
      <div className="flex items-center gap-2">
        {/* <SidebarToggle
          isCollapsed={isSidebarCollapsed}
          onClick={onSidebarToggle}
          data-testid="desktop-sidebar-toggle"
        /> */}
        <div className="h-6 w-[1px] bg-border hidden md:block" />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="h-6 w-[1px] bg-border" />
        {/* <ThemeToggle data-testid="theme-toggle" /> */}
      </div>
    </header>
  );
}
