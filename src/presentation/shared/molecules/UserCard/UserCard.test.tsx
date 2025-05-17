import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { UserCard } from '.';

// Mock react-icons/hi2 to handle SVG icon testing
vi.mock('react-icons/hi2', () => ({
  HiChevronUpDown: () => (
    <svg
      role="img"
      aria-label="Toggle menu"
      data-testid="chevron-icon"
      className="ml-auto size-4 text-muted-foreground transition-transform duration-150 data-[state=open]:rotate-180"
    />
  ),
}));

// Mock UserAvatar component
vi.mock('@/presentation/shared/atoms/UserAvatar', () => ({
  UserAvatar: ({ user }: { user: { firstName: string; lastName: string } }) => (
    <img role="img" alt={`${user.firstName} ${user.lastName}`} data-testid="user-avatar" />
  ),
}));

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    emailVerified: true,
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  it('should render user name and email', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should render avatar component', () => {
    render(<UserCard user={mockUser} />);
    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('alt', 'John Doe');
  });

  it('should show dropdown indicator when specified', () => {
    const { rerender } = render(<UserCard user={mockUser} />);
    expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();

    rerender(<UserCard user={mockUser} showDropdownIndicator />);
    const icon = screen.getByTestId('chevron-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('ml-auto', 'text-muted-foreground');
  });

  it('should apply custom className', () => {
    render(<UserCard user={mockUser} className="custom-class" />);
    const container = screen.getByTestId('user-avatar').closest('div[class*="flex"]');
    expect(container).toHaveClass('custom-class');
  });

  it('should have proper hover and active states', () => {
    render(<UserCard user={mockUser} />);
    const container = screen.getByTestId('user-avatar').closest('div[class*="flex"]');
    expect(container).toHaveClass('hover:bg-accent/80', 'hover:shadow-sm', 'active:bg-accent');
  });
});
