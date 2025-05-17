import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { OrganizationHeader } from '../';

/**
 * Test suite for OrganizationHeader component
 * Tests rendering states (expanded/collapsed), styling, interactions, and prop handling
 */

// #region Test Data Setup
const defaultProps = {
  name: 'Acme Corp',
  type: 'Enterprise',
};
// #endregion

describe('OrganizationHeader Component', () => {
  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render expanded state correctly', () => {
      // Render component in expanded state
      render(<OrganizationHeader {...defaultProps} />);

      // Verify organization info visibility
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();

      // Verify menu button visibility
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Organization menu')).toBeInTheDocument();
    });

    it('should render collapsed state correctly', () => {
      // Render component in collapsed state
      render(<OrganizationHeader {...defaultProps} isCollapsed />);

      // Verify only initial is visible
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
      expect(screen.queryByText('Enterprise')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
  // #endregion

  // #region Styling Tests
  describe('Styling', () => {
    it('should apply default classes', () => {
      // Render component
      const { container } = render(<OrganizationHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;

      // Verify default classes
      expect(header).toHaveClass('flex', 'items-center', 'h-[60px]', 'px-4', 'border-b');
    });

    it('should merge custom classes with default classes', () => {
      // Render component with custom class
      const { container } = render(
        <OrganizationHeader {...defaultProps} className="custom-class" />
      );
      const header = container.firstChild as HTMLElement;

      // Verify class merging
      expect(header).toHaveClass(
        'flex',
        'items-center',
        'h-[60px]',
        'px-4',
        'border-b',
        'custom-class'
      );
    });

    it('should apply correct classes in expanded state', () => {
      // Render component in expanded state
      const { container } = render(<OrganizationHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;

      // Verify expanded state classes
      expect(header).toHaveClass('justify-between');
      expect(header.firstChild).toHaveClass('gap-3');
    });

    it('should apply correct classes in collapsed state', () => {
      // Render component in collapsed state
      const { container } = render(<OrganizationHeader {...defaultProps} isCollapsed />);
      const header = container.firstChild as HTMLElement;

      // Verify collapsed state classes
      expect(header).toHaveClass('justify-center');
      expect(header.firstChild).toHaveClass('gap-0');
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should call onMenuClick when menu button is clicked', () => {
      // Setup click handler
      const handleMenuClick = vi.fn();

      // Render component with click handler
      render(<OrganizationHeader {...defaultProps} onMenuClick={handleMenuClick} />);

      // Trigger and verify click
      fireEvent.click(screen.getByRole('button'));
      expect(handleMenuClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when menu button is clicked without handler', () => {
      // Render component without click handler
      render(<OrganizationHeader {...defaultProps} />);

      // Verify click doesn't throw
      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props', () => {
    it('should display first character of name as initial', () => {
      // Render component with specific name
      render(<OrganizationHeader name="Zebra Inc" type="Business" />);

      // Verify initial display
      expect(screen.getByText('Z')).toBeInTheDocument();
    });

    it('should handle empty name gracefully', () => {
      // Render component with empty name
      const { container } = render(<OrganizationHeader name="" type="Business" />);
      const initial = container.querySelector('.bg-foreground') as HTMLElement;

      // Verify empty state handling
      expect(initial).toBeInTheDocument();
      expect(initial).toHaveClass('w-8', 'h-8', 'rounded-lg');
    });
  });
  // #endregion
});
