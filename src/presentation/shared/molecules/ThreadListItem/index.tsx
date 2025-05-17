import React, { useEffect, useRef, useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { HiPencil, HiTrash } from 'react-icons/hi';

import { cn } from '@/lib/utils';
import { Button } from '@/presentation/shared/atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/shared/atoms/DropdownMenu';
import { Icon } from '@/presentation/shared/atoms/Icon';

export interface ThreadListItemProps {
  /** Title of the thread */
  title: string;
  /** Optional last message preview */
  lastMessage?: string;
  /** Timestamp to display */
  timestamp: string;
  /** Whether the thread is currently active */
  isActive?: boolean;
  /** Optional icon or avatar component */
  icon?: React.ReactNode;
  /** Optional unread message count */
  unreadCount?: number;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional className for custom styling */
  className?: string;
  /** Optional handler for renaming thread */
  onRename?: (threadId: string, newTitle: string) => void;
  /** Optional handler for deleting thread */
  onDelete?: (threadId: string) => void;
  /** Thread ID */
  id: string;
}

/**
 * ThreadListItem component displays a chat thread item in a list
 * with title, last message preview, timestamp, and optional icon/avatar
 */
export const ThreadListItem: React.FC<ThreadListItemProps> = ({
  title,
  lastMessage,
  timestamp,
  isActive = false,
  icon,
  unreadCount,
  onClick,
  className,
  onRename,
  onDelete,
  id,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Effect to handle outside clicks to cancel editing
  useEffect(() => {
    if (!isEditing) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Cancel editing when clicking outside
        setIsEditing(false);
        setEditedTitle(title);
      }
    }

    // Add click event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, title]);

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTitle(title);
    setIsEditing(true);
    // Focus the input after state update
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim() && onRename) {
      onRename(id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start px-3 py-2 h-auto text-left relative group',
        'transition-colors duration-200',
        'hover:bg-accent/80 focus-visible:bg-accent/80',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive && 'bg-accent',
        className
      )}
      onClick={onClick}
      role="listitem"
      aria-selected={isActive}
    >
      <div className="flex items-start gap-2 w-full min-w-0">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="grid grid-cols-[1fr,80px] w-full min-w-0 gap-1">
          <div className="overflow-hidden min-w-0">
            {isEditing ? (
              <form ref={formRef} onSubmit={handleRenameSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onClick={handleInputClick}
                  className="w-full px-1 py-0.5 bg-background border border-input rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Thread title"
                  maxLength={100}
                  autoFocus
                />
              </form>
            ) : (
              <div className="min-w-0">
                <div className="font-medium text-sm line-clamp-2 overflow-hidden text-ellipsis">
                  {title}
                </div>
                {lastMessage && !isEditing && (
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{lastMessage}</div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end items-start min-w-0">
            <div className="flex items-center gap-0.5 justify-end">
              {unreadCount ? (
                <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full mr-1 flex-shrink-0">
                  {unreadCount}
                </span>
              ) : null}
              <div className="relative flex items-center justify-end">
                <span className="text-xs text-muted-foreground whitespace-nowrap transition-all duration-300 ease-in-out pr-1 group-hover:pr-5">
                  {timestamp}
                </span>

                {onRename && !isEditing && (
                  <div className="absolute right-0 flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out transform scale-90 group-hover:scale-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon icon={FiMoreVertical} className="h-3 w-3" />
                          <span className="sr-only">Thread options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleRenameClick}>
                          <Icon icon={HiPencil} className="mr-2 h-4 w-4" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(id);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Icon icon={HiTrash} className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
};
