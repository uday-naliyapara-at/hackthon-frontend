import { renderHook } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { vi } from 'vitest';

import { useThemeControl } from '../useThemeControl';

// Mock next-themes module
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

/**
 * Test suite for useThemeControl hook
 * Tests theme initialization, changes, cleanup, and default behaviors
 */
describe('useThemeControl Hook', () => {
  // Mock dependencies
  let mockSetTheme: ReturnType<typeof vi.fn>;
  let mockClassList: { add: typeof vi.fn; remove: typeof vi.fn };

  // #region Test Setup
  beforeEach(() => {
    // Initialize mocks
    mockSetTheme = vi.fn();
    mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    // Mock document.documentElement.classList
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: mockClassList,
      },
      writable: true,
    });

    // Setup default useTheme mock
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  // #endregion

  // #region Initialization Tests
  it('should initialize with light theme by default', () => {
    // Render hook with default theme
    renderHook(() => useThemeControl());

    // Verify light theme is applied
    expect(mockClassList.add).toHaveBeenCalledWith('light');
  });

  it('should initialize with dark theme when provided', () => {
    // Mock dark theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    // Render hook with dark theme
    renderHook(() => useThemeControl());

    // Verify dark theme is applied
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
  });

  it('should handle undefined theme by defaulting to light', () => {
    // Mock undefined theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
    });

    // Render hook with undefined theme
    renderHook(() => useThemeControl());

    // Verify fallback to light theme
    expect(mockClassList.add).toHaveBeenCalledWith('light');
  });
  // #endregion

  // #region Theme Change Tests
  it('should update theme class when theme changes', () => {
    // Setup initial theme
    let currentTheme = 'light';
    (useTheme as jest.Mock).mockReturnValue({
      theme: currentTheme,
      setTheme: mockSetTheme,
    });

    // Render hook with initial theme
    const { rerender } = renderHook(() => useThemeControl());
    expect(mockClassList.add).toHaveBeenCalledWith('light');

    // Change theme to dark
    currentTheme = 'dark';
    (useTheme as jest.Mock).mockReturnValue({
      theme: currentTheme,
      setTheme: mockSetTheme,
    });

    // Trigger re-render and verify theme change
    rerender();
    expect(mockClassList.remove).toHaveBeenCalledWith('light');
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
  });
  // #endregion

  // #region Hook Return Value Tests
  it('should return theme and setTheme from useTheme', () => {
    // Setup mock theme values
    const mockTheme = 'light';
    (useTheme as jest.Mock).mockReturnValue({
      theme: mockTheme,
      setTheme: mockSetTheme,
    });

    // Render hook and verify returned values
    const { result } = renderHook(() => useThemeControl());
    expect(result.current.theme).toBe(mockTheme);
    expect(result.current.setTheme).toBe(mockSetTheme);
  });
  // #endregion

  // #region Cleanup Tests
  it('should cleanup theme class on unmount', () => {
    // Setup dark theme
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    // Render and unmount hook
    const { unmount } = renderHook(() => useThemeControl());
    unmount();

    // Verify theme cleanup
    expect(mockClassList.remove).toHaveBeenCalledWith('dark');
  });
  // #endregion
});
