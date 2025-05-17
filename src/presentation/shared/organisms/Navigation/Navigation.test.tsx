/**
 * @vitest-environment jsdom
 */
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { HiBookOpen, HiChatBubbleLeftRight, HiCog, HiUserPlus } from 'react-icons/hi2';

import { render, screen } from '@/test/test-utils';

import { Navigation } from '..';

// Setup mocks
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: (string | undefined | null | boolean)[]) => inputs.filter(Boolean).join(' '),
}));

vi.mock('@/presentation/features/layout/constants/navigation', () => ({
  ORGANIZATION: {
    name: 'Test Org',
    type: 'Test Type',
  },
  PLATFORM_NAV_ITEMS: [
    { name: 'Chat', icon: HiChatBubbleLeftRight, 'data-testid': 'platform-chat', to: '/chat' },
    {
      name: 'User Management',
      icon: HiUserPlus,
      'data-testid': 'user-management',
      to: '/users',
      requiredRole: 'Admin',
    },
    {
      name: 'Platform Settings',
      icon: HiCog,
      'data-testid': 'platform-settings',
      requiredRole: 'Admin',
      subItems: [{ name: 'Api Settings', icon: HiCog, 'data-testid': 'api-settings' }],
    },
  ],
  NAV_SECTIONS: {
    platform: {
      title: 'Platform',
      items: [
        { name: 'Chat', icon: HiChatBubbleLeftRight, 'data-testid': 'platform-chat', to: '/chat' },
        {
          name: 'User Management',
          icon: HiUserPlus,
          'data-testid': 'user-management',
          to: '/users',
          requiredRole: 'Admin',
        },
        {
          name: 'Platform Settings',
          icon: HiCog,
          'data-testid': 'platform-settings',
          requiredRole: 'Admin',
          subItems: [{ name: 'Api Settings', icon: HiCog, 'data-testid': 'api-settings' }],
        },
      ],
    },
    developerDocs: {
      title: 'Developer Docs',
      items: [
        {
          name: 'API Documentation',
          icon: HiBookOpen,
          'data-testid': 'developer-docs-book',
          to: '/api-docs',
        },
      ],
    },
  },
}));

describe('Navigation Integration', () => {
  const user = userEvent.setup();
  const mockUser = {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    emailVerified: true,
    role: 'Admin' as const,
    status: 'Active' as const,
  };

  describe('Component Integration', () => {
    it('should handle collapse state and propagate to child components', () => {
      const { rerender } = render(<Navigation isCollapsed={false} user={mockUser} />);

      // Verify expanded state
      const orgName = screen.getByText('Test Org');
      expect(orgName).toBeInTheDocument();

      // Verify collapse state
      rerender(<Navigation isCollapsed={true} user={mockUser} />);
      const orgLetter = screen.getByText('T');
      expect(orgLetter).toBeInTheDocument();
    });

    it('should handle organization menu click events', async () => {
      const handleMenuClick = vi.fn();
      render(<Navigation onOrganizationMenuClick={handleMenuClick} user={mockUser} />);
      await user.click(screen.getByRole('button', { name: /organization menu/i }));
      expect(handleMenuClick).toHaveBeenCalled();
    });
  });

  describe('Navigation Structure', () => {
    it('should render all navigation sections with correct items and maintain hierarchy', () => {
      render(<Navigation user={mockUser} />);

      // Verify sections
      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByText('Developer Docs')).toBeInTheDocument();

      // Verify items
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Platform Settings')).toBeInTheDocument();
      expect(screen.getByText('API Documentation')).toBeInTheDocument();
    });

    it('should hide User Management and Platform Settings for non-admin users', () => {
      const regularUser = {
        ...mockUser,
        role: 'User' as const,
      };

      render(<Navigation user={regularUser} />);

      // Verify accessible items
      expect(screen.getByText('Chat')).toBeInTheDocument();

      // Verify restricted items are hidden
      expect(screen.queryByText('User Management')).not.toBeInTheDocument();
      expect(screen.queryByText('Platform Settings')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain proper focus management between sections', async () => {
      render(<Navigation user={mockUser} />);
      const chatButton = screen.getByRole('button', { name: 'Chat' });
      const apiDocsButton = screen.getByRole('button', { name: 'API Documentation' });

      chatButton.focus();
      expect(document.activeElement).toBe(chatButton);

      apiDocsButton.focus();
      expect(document.activeElement).toBe(apiDocsButton);
    });

    it('should handle keyboard navigation within sections', async () => {
      render(<Navigation user={mockUser} />);
      const chatButton = screen.getByRole('button', { name: 'Chat' });
      chatButton.focus();

      await user.keyboard('[Tab]');
      // Look for the User Management link since it's wrapped in a Link component
      const userManagementLink = screen.getByRole('link', { name: 'User Management' });
      expect(document.activeElement).toBe(userManagementLink);
    });
  });

  describe('Dynamic State Management', () => {
    it('should maintain visual states during collapse transitions', async () => {
      const { rerender } = render(<Navigation isCollapsed={false} user={mockUser} />);

      const navItem = screen.getByRole('button', { name: 'Chat' });
      expect(navItem).toHaveClass('justify-start');

      rerender(<Navigation isCollapsed={true} user={mockUser} />);
      expect(navItem).toHaveClass('justify-start');
    });
  });

  describe('Error Handling', () => {
    it('should gracefully handle missing nav items', () => {
      render(<Navigation isCollapsed={false} user={mockUser} />);
      expect(screen.queryByTestId('missing-item')).not.toBeInTheDocument();
    });
  });

  it('should render Developer Docs section', () => {
    render(<Navigation user={mockUser} />);
    expect(screen.getByText('Developer Docs')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
  });

  it('should navigate to API docs when clicking API Documentation', async () => {
    render(<Navigation user={mockUser} />);
    const apiDocsLink = screen.getByRole('link', { name: 'API Documentation' });
    expect(apiDocsLink).toHaveAttribute('href', '/api-docs');
  });
});
