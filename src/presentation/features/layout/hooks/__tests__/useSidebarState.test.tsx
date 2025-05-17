import { act, renderHook } from '@testing-library/react';

import { useSidebarState } from '../useSidebarState';

/**
 * Test suite for useSidebarState hook
 * Tests initialization, state toggling, and state persistence
 */
describe('useSidebarState Hook', () => {
  // #region Initialization Tests
  it('should initialize with default values when no props provided', () => {
    const { result } = renderHook(() => useSidebarState());

    expect(result.current.isCollapsed).toBe(false);
    expect(result.current.isMobileOpen).toBe(false);
  });

  it('should initialize with provided defaultCollapsed value', () => {
    const { result } = renderHook(() => useSidebarState({ defaultCollapsed: true }));

    expect(result.current.isCollapsed).toBe(true);
    expect(result.current.isMobileOpen).toBe(false);
  });
  // #endregion

  // #region State Toggle Tests
  it('should toggle collapsed state', () => {
    const { result } = renderHook(() => useSidebarState());

    // Initial state check
    expect(result.current.isCollapsed).toBe(false);

    // First toggle: false -> true
    act(() => {
      result.current.toggleCollapsed();
    });
    expect(result.current.isCollapsed).toBe(true);

    // Second toggle: true -> false
    act(() => {
      result.current.toggleCollapsed();
    });
    expect(result.current.isCollapsed).toBe(false);
  });

  it('should toggle mobile state', () => {
    const { result } = renderHook(() => useSidebarState());

    // Initial state check
    expect(result.current.isMobileOpen).toBe(false);

    // First toggle: false -> true
    act(() => {
      result.current.toggleMobile();
    });
    expect(result.current.isMobileOpen).toBe(true);

    // Second toggle: true -> false
    act(() => {
      result.current.toggleMobile();
    });
    expect(result.current.isMobileOpen).toBe(false);
  });
  // #endregion

  // #region Direct State Manipulation Tests
  it('should set mobile open state directly', () => {
    const { result } = renderHook(() => useSidebarState());

    // Initial state check
    expect(result.current.isMobileOpen).toBe(false);

    // Set to true
    act(() => {
      result.current.setIsMobileOpen(true);
    });
    expect(result.current.isMobileOpen).toBe(true);

    // Set to false
    act(() => {
      result.current.setIsMobileOpen(false);
    });
    expect(result.current.isMobileOpen).toBe(false);
  });
  // #endregion

  // #region State Independence Tests
  it('should maintain independent states for collapsed and mobile', () => {
    const { result } = renderHook(() => useSidebarState({ defaultCollapsed: true }));

    // Check initial states
    expect(result.current.isCollapsed).toBe(true);
    expect(result.current.isMobileOpen).toBe(false);

    // Toggle mobile state and verify collapsed state remains unchanged
    act(() => {
      result.current.toggleMobile();
    });
    expect(result.current.isCollapsed).toBe(true);
    expect(result.current.isMobileOpen).toBe(true);

    // Toggle collapsed state and verify mobile state remains unchanged
    act(() => {
      result.current.toggleCollapsed();
    });
    expect(result.current.isCollapsed).toBe(false);
    expect(result.current.isMobileOpen).toBe(true);
  });
  // #endregion

  // #region State Persistence Tests
  it('should preserve state between renders', () => {
    const { result, rerender } = renderHook(() => useSidebarState());

    // Modify both states
    act(() => {
      result.current.toggleCollapsed();
      result.current.toggleMobile();
    });

    // Trigger re-render and verify state persistence
    rerender();

    expect(result.current.isCollapsed).toBe(true);
    expect(result.current.isMobileOpen).toBe(true);
  });
  // #endregion
});
