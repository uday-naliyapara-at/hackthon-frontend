import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { HiCog, HiHome } from 'react-icons/hi2';

import { NavSection } from '..';

/**
 * Test suite for NavSection component
 * Tests rendering states (expanded/collapsed), interactions, and prop handling
 */

// #region Test Data Setup
const mockItems = [
  {
    name: 'Home',
    icon: HiHome,
    'data-testid': 'home-item',
  },
  {
    name: 'Settings',
    icon: HiCog,
    onClick: vi.fn(),
    'data-testid': 'settings-item',
    subItems: [
      {
        name: 'API Settings',
        icon: HiCog,
        'data-testid': 'api-settings',
      },
    ],
  },
];
// #endregion

describe('NavSection Component', () => {
  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render expanded state correctly', () => {
      // Render component in expanded state
      render(<NavSection title="Main Menu" items={mockItems} />);

      // Verify title rendering
      expect(screen.getByText('Main Menu')).toBeInTheDocument();
      expect(screen.getByText('Main Menu')).toHaveClass('text-muted-foreground');

      // Verify items text visibility
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();

      // Verify icons rendering
      expect(screen.getByTestId('home-item-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-item-icon')).toBeInTheDocument();
    });

    it('should render collapsed state correctly', () => {
      // Render component in collapsed state
      render(<NavSection title="Main Menu" items={mockItems} isCollapsed />);

      // Verify title is hidden
      expect(screen.queryByText('Main Menu')).not.toBeInTheDocument();

      // Verify items text is hidden but icons are visible
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      expect(screen.getByTestId('home-item-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-item-icon')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Render component with custom class
      render(<NavSection title="Main Menu" items={mockItems} className="custom-class" />);

      // Verify class application
      const sidebarGroup = screen.getByTestId('sidebar-group');
      expect(sidebarGroup).toHaveClass('custom-class');
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should call onClick handler when item is clicked', () => {
      // Setup click handler
      const handleClick = vi.fn();
      const items = [
        {
          name: 'Test',
          icon: HiHome,
          onClick: handleClick,
          'data-testid': 'test-item',
        },
      ];

      // Render and trigger click
      render(<NavSection title="Test Menu" items={items} />);
      screen.getByTestId('test-item').click();

      // Verify click handler
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when clicking item without onClick handler', () => {
      // Setup item without click handler
      const items = [
        {
          name: 'Test',
          icon: HiHome,
          'data-testid': 'test-item',
        },
      ];

      // Render and verify click doesn't throw
      render(<NavSection title="Test Menu" items={items} />);
      expect(() => {
        screen.getByTestId('test-item').click();
      }).not.toThrow();
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props', () => {
    it('should pass data-testid to items correctly', () => {
      // Render component
      render(<NavSection title="Main Menu" items={mockItems} />);

      // Verify test ids are passed through
      expect(screen.getByTestId('home-item')).toBeInTheDocument();
      expect(screen.getByTestId('settings-item')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      // Render component with empty items
      render(<NavSection title="Empty Menu" items={[]} />);

      // Verify empty state
      expect(screen.getByText('Empty Menu')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
  // #endregion
});
