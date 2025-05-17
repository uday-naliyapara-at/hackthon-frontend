/** @vitest-environment jsdom */
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { HiBookOpen, HiChatBubbleLeftRight, HiCog, HiUserPlus } from 'react-icons/hi2';

import { render, screen, waitFor } from '@/test/test-utils';

import { MobileSidebar } from '..';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: (string | undefined | null | boolean)[]) => inputs.filter(Boolean).join(' '),
}));

// Mock navigation constants
vi.mock('@/presentation/features/layout/constants/navigation', () => ({
  ORGANIZATION: {
    name: 'Efficia',
    type: 'Enterprise',
  },
  PLATFORM_NAV_ITEMS: [
    { name: 'Chat', icon: HiChatBubbleLeftRight, 'data-testid': 'platform-chat', to: '/chat' },
    {
      name: 'User Management',
      icon: HiUserPlus,
      'data-testid': 'platform-user-management',
      to: '/user-management',
      requiredRole: 'admin',
    },
    {
      name: 'Platform Settings',
      icon: HiCog,
      'data-testid': 'platform-settings',
      subItems: [{ name: 'Api Settings', icon: HiCog, 'data-testid': 'api-settings' }],
    },
  ],
  NAV_SECTIONS: {
    platform: {
      title: 'Platform',
      items: [
        { name: 'Chat', icon: HiChatBubbleLeftRight, 'data-testid': 'platform-chat', to: '/chat' },
        {
          name: 'Platform Settings',
          icon: HiCog,
          'data-testid': 'platform-settings',
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

/**
 * Integration test suite for MobileSidebar
 * Tests complex interactions between Sheet, Navigation, and focus management
 */
describe('MobileSidebar Integration', () => {
  const user = userEvent.setup();

  // Mock user with admin role
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    emailVerified: true,
    role: 'admin' as const,
  };

  it('should render correctly', () => {
    render(<MobileSidebar open={true} onOpenChange={() => {}} user={mockUser} />);
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Developer Docs')).toBeInTheDocument();
  });

  it('should navigate to API docs and close sidebar in mobile view', async () => {
    const handleOpenChange = vi.fn();
    render(<MobileSidebar open={true} onOpenChange={handleOpenChange} user={mockUser} />);

    await user.click(screen.getByRole('link', { name: 'API Documentation' }));
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should handle navigation item clicks', async () => {
    const handleOpenChange = vi.fn();
    render(<MobileSidebar open={true} onOpenChange={handleOpenChange} user={mockUser} />);

    await user.click(screen.getByRole('link', { name: 'Chat' }));
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should handle organization menu click', async () => {
    const handleOpenChange = vi.fn();
    render(<MobileSidebar open={true} onOpenChange={handleOpenChange} user={mockUser} />);

    await user.click(screen.getByRole('button', { name: 'Organization menu' }));
    expect(screen.getByText('Efficia')).toBeInTheDocument();
  });
});
