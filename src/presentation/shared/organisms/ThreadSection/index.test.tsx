import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import type { Thread } from '@/presentation/features/chat/types/thread';

import { ThreadSection } from './index';

describe('ThreadSection', () => {
  // Mock data
  const mockThreads: Thread[] = [
    {
      id: '1',
      title: 'Thread 1',
      lastMessage: 'Last message 1',
      timestamp: new Date('2024-03-20T10:00:00').toISOString(),
      date: new Date('2024-03-20T10:00:00'),
    },
    {
      id: '2',
      title: 'Thread 2',
      lastMessage: 'Last message 2',
      timestamp: new Date('2024-03-20T11:00:00').toISOString(),
      date: new Date('2024-03-20T11:00:00'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // #region Rendering Tests
  it('should render section title and threads', () => {
    render(<ThreadSection title="Today's Threads" threads={mockThreads} />);

    // Check if title is rendered
    expect(screen.getByText("Today's Threads")).toBeInTheDocument();

    // Check if all threads are rendered
    expect(screen.getByText('Thread 1')).toBeInTheDocument();
    expect(screen.getByText('Thread 2')).toBeInTheDocument();
    expect(screen.getByText('Last message 1')).toBeInTheDocument();
    expect(screen.getByText('Last message 2')).toBeInTheDocument();
  });

  it('should highlight active thread', () => {
    render(<ThreadSection title="Today's Threads" threads={mockThreads} activeThreadId="1" />);

    // Get all thread items
    const threadItems = screen.getAllByRole('listitem');

    // First thread should have active class
    expect(threadItems[0]).toHaveClass('bg-accent');
    // Second thread should not have active class
    expect(threadItems[1]).not.toHaveClass('bg-accent');
  });

  it('should not render anything when threads array is empty', () => {
    render(<ThreadSection title="Empty Section" threads={[]} />);

    // Section title should not be rendered
    expect(screen.queryByText('Empty Section')).not.toBeInTheDocument();
  });
  // #endregion

  // #region Interaction Tests
  it('should call onThreadSelect when a thread is clicked', async () => {
    const onThreadSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <ThreadSection
        title="Today's Threads"
        threads={mockThreads}
        onThreadSelect={onThreadSelect}
      />
    );

    // Click the first thread
    await user.click(screen.getByText('Thread 1'));

    // Check if onThreadSelect was called with correct thread id
    expect(onThreadSelect).toHaveBeenCalledWith('1');
  });

  it('should not throw error when onThreadSelect is not provided', async () => {
    const user = userEvent.setup();

    render(<ThreadSection title="Today's Threads" threads={mockThreads} />);

    // Click should not throw error
    await user.click(screen.getByText('Thread 1'));
  });
  // #endregion
});
