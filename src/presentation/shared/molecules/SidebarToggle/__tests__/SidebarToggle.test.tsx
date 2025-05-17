import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SidebarToggle } from '../';

/**
 * Test suite for SidebarToggle component
 * Tests rendering states, interactions, styling, and prop handling
 */
describe('SidebarToggle Component', () => {
  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render expand icon when sidebar is collapsed', () => {
      // Render component in collapsed state
      render(<SidebarToggle isCollapsed data-testid="sidebar-toggle" />);

      // Verify correct icon rendering
      expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-expand-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-collapse-icon')).not.toBeInTheDocument();
    });

    it('should render collapse icon when sidebar is expanded', () => {
      // Render component in expanded state
      render(<SidebarToggle isCollapsed={false} data-testid="sidebar-toggle" />);

      // Verify correct icon rendering
      expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-collapse-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-expand-icon')).not.toBeInTheDocument();
    });

    it('should have accessible label', () => {
      // Render component
      render(<SidebarToggle isCollapsed />);

      // Verify accessibility
      expect(screen.getByText('Toggle sidebar')).toBeInTheDocument();
    });
  });
  // #endregion

  // #region Styling Tests
  describe('Styling', () => {
    it('should apply default classes', () => {
      // Render component
      render(<SidebarToggle isCollapsed data-testid="sidebar-toggle" />);

      // Verify default classes
      expect(screen.getByTestId('sidebar-toggle')).toHaveClass('hidden', 'md:flex');
    });

    it('should merge custom classes with default classes', () => {
      // Render component with custom class
      render(<SidebarToggle isCollapsed className="custom-class" data-testid="sidebar-toggle" />);

      // Verify class merging
      const button = screen.getByTestId('sidebar-toggle');
      expect(button).toHaveClass('hidden', 'md:flex', 'custom-class');
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should call onClick handler when clicked', () => {
      // Setup click handler
      const handleClick = vi.fn();

      // Render component with click handler
      render(<SidebarToggle isCollapsed onClick={handleClick} data-testid="sidebar-toggle" />);

      // Trigger and verify click
      fireEvent.click(screen.getByTestId('sidebar-toggle'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when clicked without onClick handler', () => {
      // Render component without click handler
      render(<SidebarToggle isCollapsed data-testid="sidebar-toggle" />);

      // Verify click doesn't throw
      expect(() => {
        fireEvent.click(screen.getByTestId('sidebar-toggle'));
      }).not.toThrow();
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props', () => {
    it('should apply data-testid prop correctly', () => {
      // Render with custom test id
      render(<SidebarToggle isCollapsed data-testid="custom-test-id" />);

      // Verify prop application
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('should have isCollapsed as a required prop', () => {
      // Type test - will fail at compile time if isCollapsed is not required
      // @ts-expect-error - isCollapsed prop is required
      render(<SidebarToggle />);
    });
  });
  // #endregion
});
