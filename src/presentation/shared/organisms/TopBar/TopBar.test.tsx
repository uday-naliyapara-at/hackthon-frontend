import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from 'next-themes';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { TopBar } from '../';

// Test component to verify theme changes
function ThemeVerifier() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <div data-testid="theme-verifier">
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
    </div>
  );
}

const renderTopBar = (props?: React.ComponentProps<typeof TopBar>) => {
  return render(
    <ThemeProvider defaultTheme="light" enableSystem={false} attribute="class">
      <ThemeVerifier />
      <TopBar {...props} />
    </ThemeProvider>
  );
};

describe('TopBar', () => {
  beforeEach(() => {
    // Clean up both class and data-theme attributes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Theme Toggle', () => {
    test('renders theme toggle button', () => {
      renderTopBar();
      const themeToggle = screen.getByTestId('theme-toggle');

      expect(themeToggle).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    test('toggles theme functionality', async () => {
      renderTopBar();
      const themeToggle = screen.getByTestId('theme-toggle');

      // Initial state
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(document.documentElement).not.toHaveClass('dark');
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

      // Toggle to dark
      fireEvent.click(themeToggle);
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveClass('dark');
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

      // Toggle back to light
      fireEvent.click(themeToggle);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(document.documentElement).not.toHaveClass('dark');
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    test('applies theme class to html element', () => {
      renderTopBar();
      const themeToggle = screen.getByTestId('theme-toggle');

      // Initial state
      expect(document.documentElement).not.toHaveClass('dark');

      // Toggle to dark
      fireEvent.click(themeToggle);
      expect(document.documentElement).toHaveClass('dark');

      // Toggle back to light
      fireEvent.click(themeToggle);
      expect(document.documentElement).not.toHaveClass('dark');
    });
  });

  describe('Desktop Sidebar Toggle', () => {
    test('renders with correct icon based on sidebar state', () => {
      const mockToggle = vi.fn();
      renderTopBar({ onSidebarToggle: mockToggle, isSidebarCollapsed: false });

      const toggleButton = screen.getByTestId('desktop-sidebar-toggle');
      expect(toggleButton).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-collapse-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-expand-icon')).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    test('shows expand icon when sidebar is collapsed', () => {
      renderTopBar({ isSidebarCollapsed: true });

      expect(screen.getByTestId('sidebar-expand-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-collapse-icon')).not.toBeInTheDocument();
    });
  });
});
