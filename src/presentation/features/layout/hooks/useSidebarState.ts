import { useCallback, useState } from 'react';

export interface UseSidebarStateProps {
  defaultCollapsed?: boolean;
}

export function useSidebarState({ defaultCollapsed = false }: UseSidebarStateProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    setIsMobileOpen,
  };
}
