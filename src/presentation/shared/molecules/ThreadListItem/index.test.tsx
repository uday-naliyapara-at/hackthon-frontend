import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ThreadListItem } from './index';

describe('ThreadListItem', () => {
  const mockProps = {
    title: 'Test Thread',
    lastMessage: 'Hello World',
    timestamp: '2 min ago',
    onClick: vi.fn(),
  };

  it('renders thread item with all props', () => {
    render(<ThreadListItem {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.lastMessage!)).toBeInTheDocument();
    expect(screen.getByText(mockProps.timestamp)).toBeInTheDocument();
  });

  it('renders thread item without last message', () => {
    const propsWithoutMessage = {
      ...mockProps,
      lastMessage: undefined,
    };
    render(<ThreadListItem {...propsWithoutMessage} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<ThreadListItem {...mockProps} />);
    fireEvent.click(screen.getByText(mockProps.title));
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it('applies active styles when isActive is true', () => {
    render(<ThreadListItem {...mockProps} isActive />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('bg-accent');
  });
});
