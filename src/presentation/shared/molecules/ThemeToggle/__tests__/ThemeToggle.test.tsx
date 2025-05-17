import { fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { vi } from 'vitest';

import { ThemeToggle } from '../';

// Mock next-themes module
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

/**
 * Test suite for ThemeToggle component
 * Tests rendering states, theme switching, accessibility, and prop handling
 */
describe('ThemeToggle Component', () => {
  // Mock for useTheme hook
  const mockUseTheme = useTheme as jest.Mock;

  // #region Test Setup
  beforeEach(() => {
    mockUseTheme.mockReset();
  });
  // #endregion

  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render moon icon in light theme', () => {
      // Setup light theme
      mockUseTheme.mockReturnValue({ theme: 'light', setTheme: vi.fn() });

      // Render component
      render(<ThemeToggle data-testid="theme-toggle" />);

      // Verify correct icon rendering
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    it('should render sun icon in dark theme', () => {
      // Setup dark theme
      mockUseTheme.mockReturnValue({ theme: 'dark', setTheme: vi.fn() });

      // Render component
      render(<ThemeToggle data-testid="theme-toggle" />);

      // Verify correct icon rendering
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('should have accessible label', () => {
      // Setup theme
      mockUseTheme.mockReturnValue({ theme: 'light', setTheme: vi.fn() });

      // Render component
      render(<ThemeToggle />);

      // Verify accessibility
      expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should toggle from light to dark theme when clicked', () => {
      // Setup mock theme handler
      const setTheme = vi.fn();
      mockUseTheme.mockReturnValue({ theme: 'light', setTheme });

      // Render and trigger click
      render(<ThemeToggle data-testid="theme-toggle" />);
      fireEvent.click(screen.getByTestId('theme-toggle'));

      // Verify theme change
      expect(setTheme).toHaveBeenCalledWith('dark');
    });

    it('should toggle from dark to light theme when clicked', () => {
      // Setup mock theme handler
      const setTheme = vi.fn();
      mockUseTheme.mockReturnValue({ theme: 'dark', setTheme });

      // Render and trigger click
      render(<ThemeToggle data-testid="theme-toggle" />);
      fireEvent.click(screen.getByTestId('theme-toggle'));

      // Verify theme change
      expect(setTheme).toHaveBeenCalledWith('light');
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props', () => {
    it('should apply data-testid prop correctly', () => {
      // Setup theme
      mockUseTheme.mockReturnValue({ theme: 'light', setTheme: vi.fn() });

      // Render with custom test id
      render(<ThemeToggle data-testid="custom-test-id" />);

      // Verify prop application
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });
  // #endregion
});
