import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { ReactNode } from 'react';

import { User } from '@/domain/models/user/types';

import { UserNavigation } from '.';

interface MockComponentProps {
  children?: ReactNode;
}

interface UserCardProps extends MockComponentProps {
  user: User;
  showDropdownIndicator?: boolean;
}

interface DropdownMenuContentProps extends MockComponentProps {
  side?: string;
  align?: string;
  sideOffset?: number;
}

interface DropdownMenuItemProps extends MockComponentProps {
  onClick?: () => void;
}

// Mock the UserCard component
vi.mock('@/presentation/shared/molecules/UserCard', () => ({
  UserCard: ({ user, showDropdownIndicator }: UserCardProps) => (
    <div data-testid="user-card" data-state={showDropdownIndicator ? 'open' : 'closed'}>
      <span>
        {user.firstName} {user.lastName}
      </span>
      <span>{user.email}</span>
    </div>
  ),
}));

// Mock the shadcn/ui components
vi.mock('@/presentation/shared/atoms/DropdownMenu', () => ({
  DropdownMenu: ({ children }: MockComponentProps) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children, side, align, sideOffset }: DropdownMenuContentProps) => (
    <div
      data-testid="dropdown-content"
      data-side={side}
      data-align={align}
      data-offset={sideOffset}
    >
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children }: MockComponentProps) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: DropdownMenuItemProps) => (
    <button data-testid="dropdown-item" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenuLabel: ({ children }: MockComponentProps) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuGroup: ({ children }: MockComponentProps) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
}));

// Mock the sidebar components
vi.mock('@/presentation/shared/atoms/Sidebar', () => ({
  SidebarMenu: ({ children }: MockComponentProps) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: MockComponentProps) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
}));

describe('UserNavigation', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    emailVerified: true,
    avatarUrl: 'https://example.com/avatar.jpg',
    status: 'Active' as const,
  };

  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  it('should render user card in dropdown trigger', () => {
    render(<UserNavigation user={mockUser} />);

    // Get the user card within the dropdown trigger
    const dropdownTrigger = screen.getByTestId('dropdown-trigger');
    const userCard = within(dropdownTrigger).getByTestId('user-card');

    expect(userCard).toBeInTheDocument();
    expect(userCard).toHaveTextContent('John Doe');
    expect(userCard).toHaveTextContent('john@example.com');
  });

  it('should show dropdown menu items', () => {
    render(<UserNavigation user={mockUser} />);

    const items = screen.getAllByTestId('dropdown-item');
    expect(items).toHaveLength(5); // Upgrade, Account, Billing, Notifications, Logout
    expect(items[0]).toHaveTextContent('Upgrade to Pro');
    expect(items[1]).toHaveTextContent('Account');
    expect(items[2]).toHaveTextContent('Billing');
    expect(items[3]).toHaveTextContent('Notifications');
    expect(items[4]).toHaveTextContent('Log out');
  });

  it('should call onLogout when logout clicked', () => {
    render(<UserNavigation user={mockUser} onLogout={mockOnLogout} />);

    const logoutButton = screen
      .getAllByTestId('dropdown-item')
      .find((item) => item.textContent === 'Log out');
    fireEvent.click(logoutButton!);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('should position dropdown correctly based on mobile prop', () => {
    const { rerender } = render(<UserNavigation user={mockUser} isMobile={false} />);
    const content = screen.getByTestId('dropdown-content');
    expect(content).toHaveAttribute('data-side', 'right');
    expect(content).toHaveAttribute('data-align', 'end');

    rerender(<UserNavigation user={mockUser} isMobile={true} />);
    expect(content).toHaveAttribute('data-side', 'bottom');
    expect(content).toHaveAttribute('data-align', 'end');
  });
});
