import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import React from 'react';

import { ThreadListItem } from '../index';

describe('ThreadListItem', () => {
  const defaultProps = {
    id: 'thread-1',
    title: 'Test Thread',
    timestamp: '2h ago',
    onClick: vi.fn(),
    onRename: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders correctly with default props', () => {
    render(<ThreadListItem {...defaultProps} />);

    expect(screen.getByText('Test Thread')).toBeInTheDocument();
    expect(screen.getByText('2h ago')).toBeInTheDocument();
  });

  it('handles long titles without breaking layout', () => {
    const longTitle =
      'This is an extremely long title that should be truncated and not break the layout of the component especially the timestamp and options button visibility';

    render(<ThreadListItem {...defaultProps} title={longTitle} />);

    // The title should be present (even if visually truncated)
    expect(screen.getByText(longTitle)).toBeInTheDocument();

    // The timestamp should still be visible and not pushed out of view
    expect(screen.getByText('2h ago')).toBeInTheDocument();

    // Check that the parent container has a grid layout
    const mainContainer = screen.getByRole('listitem').querySelector('.grid');
    expect(mainContainer).toHaveClass('grid-cols-[1fr,80px]');

    // Verify title is properly contained
    const titleContainer = screen.getByText(longTitle).closest('div');
    expect(titleContainer).toHaveClass('overflow-hidden');
  });

  it('renders with unread count', () => {
    render(<ThreadListItem {...defaultProps} unreadCount={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
