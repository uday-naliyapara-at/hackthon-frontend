import { Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useAuth, useLogout } from '@/presentation/features/auth/hooks';
import { useSidebarState } from '@/presentation/features/layout/hooks';
import { Skeleton } from '@/presentation/shared/atoms/Skeleton';
import { useToast } from '@/presentation/shared/atoms/Toast';
import { MobileSidebar, Sidebar, TopBar } from '@/presentation/shared/organisms';

interface AppLayoutProps {
  /** Whether to apply padding to the main content area */
  withPadding?: boolean;
}

export function AppLayout({ withPadding = false }: AppLayoutProps) {
  const { isCollapsed, isMobileOpen, toggleCollapsed, setIsMobileOpen } = useSidebarState();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const { logout } = useLogout({
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: error.message || 'Failed to logout. Please try again.',
      });
    },
  });

  if (isLoading || !user) {
    return (
      <div className="flex h-screen">
        <Skeleton className="h-full w-64" />
        <div className="flex-1">
          <Skeleton className="h-16 w-full" />
          <div className="p-4">
            <Skeleton className="h-[80vh] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-x-hidden">
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <TopBar 
          onSidebarToggle={toggleCollapsed} 
          isSidebarCollapsed={isCollapsed} 
          user={user}
        />
        <main
          className={cn('flex-1 !overflow-x-hidden', withPadding && 'p-4 sm:p-6 md:p-8')}
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
