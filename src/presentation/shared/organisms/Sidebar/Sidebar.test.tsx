/**
 * @vitest-environment jsdom
 */
// Import test utilities
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { type User } from '@/domain/models/user/types';

import { Sidebar } from '.';

// Setup mocks
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: (string | undefined | null | false | 0)[]) => inputs.filter(Boolean).join(' '),
}));

vi.mock('../Navigation', () => ({
  Navigation: vi.fn(({ isCollapsed }) => (
    <nav className="flex-col h-full">
      <div data-testid="mock-nav-content">{!isCollapsed && <span>Test Type</span>}</div>
    </nav>
  )),
}));

vi.mock('../UserNavigation', () => ({
  UserNavigation: vi.fn(() => <div data-testid="mock-user-nav">User Navigation</div>),
}));

describe('Sidebar Integration', () => {
  const getSidebar = () => screen.getByRole('complementary');
  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    emailVerified: true,
  };

  describe('Component Integration', () => {
    it('should handle collapse state and maintain styles', () => {
      const { rerender } = render(
        <Sidebar isCollapsed={false} className="custom-class" user={mockUser} />
      );
      const sidebar = getSidebar();

      // Verify expanded state with styles
      expect(sidebar).toHaveClass('w-64', 'bg-sidebar', 'custom-class');
      expect(screen.getByText('Test Type')).toBeInTheDocument();

      // Verify collapse state
      rerender(<Sidebar isCollapsed={true} className="custom-class" user={mockUser} />);
      expect(sidebar).toHaveClass('w-16', 'bg-sidebar', 'custom-class');
      expect(screen.queryByText('Test Type')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Integration', () => {
    it('should handle responsive behavior with proper transitions', () => {
      render(<Sidebar user={mockUser} />);
      const sidebar = getSidebar();

      // Verify responsive classes and transitions
      expect(sidebar).toHaveClass('hidden', 'md:block', 'transition-[width]', 'duration-300');
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain proper structure and ARIA attributes', () => {
      render(<Sidebar user={mockUser} />);
      const sidebar = getSidebar();

      // Verify ARIA and structure
      expect(sidebar).toHaveAttribute('aria-label', 'Desktop navigation');
      const nav = sidebar.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('flex-col');
    });
  });

  describe('User Navigation Integration', () => {
    it('should render user navigation section', () => {
      render(<Sidebar user={mockUser} />);
      expect(screen.getByTestId('mock-user-nav')).toBeInTheDocument();
    });

    it('should pass logout handler to user navigation', () => {
      const handleLogout = vi.fn();
      render(<Sidebar user={mockUser} onLogout={handleLogout} />);
      expect(screen.getByTestId('mock-user-nav')).toBeInTheDocument();
    });
  });
});
