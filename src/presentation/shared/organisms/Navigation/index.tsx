import { User } from '@/domain/models/user/types';
import { cn } from '@/lib/utils';
import {
  NAV_SECTIONS,
  ORGANIZATION,
  PLATFORM_NAV_ITEMS,
} from '@/presentation/features/layout/constants/navigation';
import { NavSection, OrganizationHeader } from '@/presentation/shared/molecules';

export interface NavigationProps {
  isCollapsed?: boolean;
  className?: string;
  onOrganizationMenuClick?: () => void;
  onNavigationItemClick?: () => void;
  user?: User;
}

export function Navigation({
  isCollapsed = false,
  className,
  onOrganizationMenuClick,
  onNavigationItemClick,
  user,
}: NavigationProps) {
  // Filter platform nav items based on user role
  const filteredPlatformItems = PLATFORM_NAV_ITEMS.filter((item) => {
    // Show items without a requiredRole to all users
    if (!item.requiredRole) {
      return true;
    }

    // Only show items with requiredRole if user has that role
    return user?.role === item.requiredRole;
  });

  return (
    <nav className={cn('flex flex-col h-full', className)}>
      {/* <OrganizationHeader
        name={ORGANIZATION.name}
        type={ORGANIZATION.type}
        isCollapsed={isCollapsed}
        onMenuClick={onOrganizationMenuClick}
      /> */}
      {/* <div className="flex-1 px-2 py-4">
        <div className="space-y-4">
          <NavSection
            title={NAV_SECTIONS.platform.title}
            items={filteredPlatformItems.map((item) => ({
              ...item,
              onClick: onNavigationItemClick,
            }))}
            isCollapsed={isCollapsed}
          />
          <NavSection
            title={NAV_SECTIONS.developerDocs.title}
            items={NAV_SECTIONS.developerDocs.items.map((item) => ({
              ...item,
              onClick: onNavigationItemClick,
            }))}
            isCollapsed={isCollapsed}
          />
        </div>
      </div> */}
    </nav>
  );
}
