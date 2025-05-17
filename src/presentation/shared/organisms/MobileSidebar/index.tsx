'use client';

import { useEffect } from 'react';

import { type User } from '@/domain/models/user/types';
// import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/presentation/shared/atoms';
import { SidebarToggle } from '@/presentation/shared/molecules/SidebarToggle';

// import { Navigation } from '../Navigation';
// import { UserNavigation } from '../UserNavigation';

export interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onLogout?: () => void;
}

export function MobileSidebar({ open, onOpenChange, }: MobileSidebarProps) {
  useEffect(() => {
    if (open) {
      // Small delay to ensure the button is rendered
      const timer = setTimeout(() => {
        const firstButton = document.querySelector('[data-testid="platform-playcircle"]');
        if (firstButton instanceof HTMLElement) {
          firstButton.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      <div className="fixed left-4 top-4 z-50 flex items-center gap-2 md:hidden">
        <SidebarToggle
          isCollapsed={!open}
          onClick={() => onOpenChange(true)}
          className="!flex"
          data-testid="sidebar-toggle"
        />
        <div className="h-6 w-[1px] bg-border" />
      </div>

      {/* <Sheet open={open} onOpenChange={onOpenChange} modal>
        <SheetContent
          side="left"
          className="flex h-full w-80 flex-col p-0"
          onCloseAutoFocus={() => {
            const toggleButton = document.querySelector('[data-testid="sidebar-toggle"]');
            if (toggleButton instanceof HTMLElement) {
              toggleButton.focus();
            }
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          onPointerDownOutside={() => onOpenChange(false)}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Application navigation menu</SheetDescription>

          <div className="flex h-full flex-col">
            <Navigation
              data-testid="mobile-nav"
              onOrganizationMenuClick={() => onOpenChange(false)}
              onNavigationItemClick={() => onOpenChange(false)}
              user={user}
            />
            {user && (
              <div className="flex-shrink-0 border-t border-border/50 bg-sidebar/50 p-2">
                <UserNavigation user={user} onLogout={onLogout} isMobile />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet> */}
    </>
  );
}
