import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';
import { UserAvatar } from '@/presentation/shared/atoms/UserAvatar';

import { ThreadListItem } from './index';

// Define the props for the ThreadListItem component
const threadListItemProps: PropDef[] = [
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Title of the thread',
  },
  {
    name: 'lastMessage',
    type: 'string',
    description: 'Optional last message preview',
  },
  {
    name: 'timestamp',
    type: 'string',
    required: true,
    description: 'Timestamp to display',
  },
  {
    name: 'isActive',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the thread is currently active',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Optional icon or avatar component',
  },
  {
    name: 'unreadCount',
    type: 'number',
    description: 'Optional unread message count',
  },
  {
    name: 'onClick',
    type: '() => void',
    description: 'Optional click handler',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional className for custom styling',
  },
];

export const ThreadListItemDocs: React.FC = () => {
  // Mock user for avatar
  const mockUser = {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    emailVerified: true,
    avatarUrl: '',
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">ThreadListItem</h2>
        <p>
          The ThreadListItem component displays a chat thread item in a list with title, last
          message preview, timestamp, and optional icon or avatar. It's designed for chat or message
          applications to display conversation threads in a sidebar or list view.
        </p>
      </div>

      <PropsTable props={threadListItemProps} />

      <ComponentExample
        name="Basic Thread Item"
        description="A simple thread list item with title and timestamp"
        code={`<ThreadListItem
  title="Project Discussion"
  timestamp="2:30 PM"
  onClick={() => console.log('Thread clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <ThreadListItem title="Project Discussion" timestamp="2:30 PM" onClick={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Last Message Preview"
        description="Thread item showing a preview of the last message"
        code={`<ThreadListItem
  title="Team Updates"
  lastMessage="Let's schedule a meeting to discuss progress"
  timestamp="11:45 AM"
  onClick={() => console.log('Thread clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <ThreadListItem
            title="Team Updates"
            lastMessage="Let's schedule a meeting to discuss progress"
            timestamp="11:45 AM"
            onClick={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Active Thread"
        description="Thread item in active state with background highlighting"
        code={`<ThreadListItem
  title="Active Conversation"
  lastMessage="This is the currently selected thread"
  timestamp="Just now"
  isActive={true}
  onClick={() => console.log('Thread clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <ThreadListItem
            title="Active Conversation"
            lastMessage="This is the currently selected thread"
            timestamp="Just now"
            isActive={true}
            onClick={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Avatar"
        description="Thread item with user avatar as icon"
        code={`<ThreadListItem
  title="Jane Doe"
  lastMessage="Hey, how are you doing?"
  timestamp="Yesterday"
  icon={<UserAvatar user={user} size="sm" />}
  onClick={() => console.log('Thread clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <ThreadListItem
            title="Jane Doe"
            lastMessage="Hey, how are you doing?"
            timestamp="Yesterday"
            icon={<UserAvatar user={mockUser} size="sm" />}
            onClick={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Unread Count"
        description="Thread item showing unread message count indicator"
        code={`<ThreadListItem
  title="Team Chat"
  lastMessage="New project announcement"
  timestamp="9:15 AM"
  unreadCount={5}
  onClick={() => console.log('Thread clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <ThreadListItem
            title="Team Chat"
            lastMessage="New project announcement"
            timestamp="9:15 AM"
            unreadCount={5}
            onClick={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Thread List"
        description="Multiple thread items in a list context"
        code={`<div className="space-y-1">
  <ThreadListItem
    title="Design Team"
    lastMessage="Let's review the new mockups"
    timestamp="10:30 AM"
    unreadCount={3}
    icon={<UserAvatar user={user1} size="sm" />}
  />
  <ThreadListItem
    title="Development"
    lastMessage="PR #123 has been merged"
    timestamp="Yesterday"
    icon={<UserAvatar user={user2} size="sm" />}
  />
  <ThreadListItem
    title="Product Meeting"
    lastMessage="Meeting notes shared"
    timestamp="2 days ago"
    icon={<UserAvatar user={user3} size="sm" />}
    isActive={true}
  />
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <div className="space-y-1">
            <ThreadListItem
              title="Design Team"
              lastMessage="Let's review the new mockups"
              timestamp="10:30 AM"
              unreadCount={3}
              icon={<UserAvatar user={{ ...mockUser, firstName: 'Alex' }} size="sm" />}
            />
            <ThreadListItem
              title="Development"
              lastMessage="PR #123 has been merged"
              timestamp="Yesterday"
              icon={<UserAvatar user={{ ...mockUser, firstName: 'Taylor' }} size="sm" />}
            />
            <ThreadListItem
              title="Product Meeting"
              lastMessage="Meeting notes shared"
              timestamp="2 days ago"
              icon={<UserAvatar user={{ ...mockUser, firstName: 'Morgan' }} size="sm" />}
              isActive={true}
            />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="Custom Styling"
        description="Thread item with custom styling"
        code={`<ThreadListItem
  title="Custom Styled Thread"
  lastMessage="This thread has custom styling"
  timestamp="3:45 PM"
  className="border-l-4 border-l-primary"
  onClick={() => console.log('Thread clicked')}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden">
          <ThreadListItem
            title="Custom Styled Thread"
            lastMessage="This thread has custom styling"
            timestamp="3:45 PM"
            className="border-l-4 border-l-primary"
            onClick={() => {}}
          />
        </div>
      </ComponentExample>
    </div>
  );
};
