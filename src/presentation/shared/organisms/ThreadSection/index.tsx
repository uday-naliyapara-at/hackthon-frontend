import React from 'react';

import { Thread } from '@/presentation/features/chat/types/thread';
import { ThreadListItem } from '@/presentation/shared/molecules/ThreadListItem';

export interface ThreadSectionProps {
  /** Title of the section */
  title: string;
  /** List of threads to display */
  threads: Thread[];
  /** ID of the currently active thread */
  activeThreadId?: string;
  /** Callback when a thread is selected */
  onThreadSelect?: (threadId: string) => void;
  /** Optional callback for renaming thread */
  onRenameThread?: (threadId: string, newTitle: string) => void;
  /** Optional callback for deleting thread */
  onDeleteThread?: (threadId: string) => void;
}

/**
 * ThreadSection component displays a group of threads with a title
 * Used to group threads by time period or any other categorization
 *
 * @example
 * ```tsx
 * <ThreadSection
 *   title="Today"
 *   threads={todayThreads}
 *   activeThreadId="123"
 *   onThreadSelect={(id) => console.log(id)}
 * />
 * ```
 */
export const ThreadSection = React.memo<ThreadSectionProps>(
  ({ title, threads, activeThreadId, onThreadSelect, onRenameThread, onDeleteThread }) => {
    if (threads.length === 0) return null;

    return (
      <div className="space-y-1">
        <div className="px-4 py-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 -mt-2">
          <h3 className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-[0.15em]">
            {title}
          </h3>
        </div>
        <div className="space-y-0.5 pb-4">
          {threads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              id={thread.id}
              title={thread.title}
              lastMessage={thread.lastMessage}
              timestamp={thread.timestamp}
              isActive={thread.id === activeThreadId}
              onClick={() => onThreadSelect?.(thread.id)}
              onRename={onRenameThread}
              onDelete={onDeleteThread}
            />
          ))}
        </div>
      </div>
    );
  }
);

ThreadSection.displayName = 'ThreadSection';
