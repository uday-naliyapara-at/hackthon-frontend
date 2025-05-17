import React from 'react';

import { PropDef, PropsTable } from '@/presentation/features/docs/atom/PropsTable';
import { ComponentExample } from '@/presentation/features/docs/molecules/ComponentExample';

import { ThreadSection } from './index';

// Define the props for the ThreadSection component
const threadSectionProps: PropDef[] = [
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Title of the section',
  },
  {
    name: 'threads',
    type: 'Thread[]',
    required: true,
    description: 'List of threads to display',
  },
  {
    name: 'activeThreadId',
    type: 'string',
    description: 'ID of the currently active thread',
  },
  {
    name: 'onThreadSelect',
    type: '(threadId: string) => void',
    description: 'Callback when a thread is selected',
  },
];

// Thread object interface props
const threadObjectProps: PropDef[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique identifier for the thread',
  },
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Title of the thread',
  },
  {
    name: 'lastMessage',
    type: 'string',
    description: 'Preview of the last message in the thread',
  },
  {
    name: 'timestamp',
    type: 'string',
    required: true,
    description: 'Time information for the thread',
  },
  {
    name: 'date',
    type: 'Date',
    required: true,
    description: 'Creation/update date of the thread',
  },
];

export const ThreadSectionDocs: React.FC = () => {
  // Sample thread data
  const todayThreads = [
    {
      id: '1',
      title: 'Project Discussion',
      lastMessage: 'Let me know when you have time to discuss this',
      timestamp: '10:30 AM',
      date: new Date(),
    },
    {
      id: '2',
      title: 'UI Design Feedback',
      lastMessage: 'The new design looks great!',
      timestamp: '9:15 AM',
      date: new Date(),
    },
    {
      id: '3',
      title: 'API Integration',
      lastMessage: 'I fixed the authentication issue',
      timestamp: '8:45 AM',
      date: new Date(),
    },
  ];

  const yesterdayThreads = [
    {
      id: '4',
      title: 'Weekly Planning',
      lastMessage: "Let's schedule the meeting for Monday",
      timestamp: 'Yesterday',
      date: new Date(Date.now() - 86400000),
    },
    {
      id: '5',
      title: 'Bug Report Followup',
      lastMessage: 'All issues have been resolved',
      timestamp: 'Yesterday',
      date: new Date(Date.now() - 86400000),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="prose max-w-none dark:prose-invert mb-8">
        <h2 className="text-2xl font-bold">ThreadSection</h2>
        <p>
          The ThreadSection component is an organism that displays a group of conversation threads
          with a title. It's used to organize threads by time period (Today, Yesterday, This Week)
          or other categorization. Each section contains multiple thread items that users can
          select.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Component Props</h3>
          <PropsTable props={threadSectionProps} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Thread Object Props</h3>
          <PropsTable props={threadObjectProps} />
        </div>
      </div>

      <ComponentExample
        name="Basic Thread Section"
        description="Thread section displaying a group of threads with a title"
        code={`// Sample thread data
const todayThreads = [
  {
    id: '1',
    title: 'Project Discussion',
    lastMessage: 'Let\\'s schedule a meeting for next week',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    title: 'Design Team Updates',
    lastMessage: 'I\\'ve uploaded the new mockups to Figma',
    timestamp: '9:15 AM'
  },
  {
    id: '3',
    title: 'Weekly Planning',
    lastMessage: 'Can everyone share their priorities?',
    timestamp: '8:45 AM'
  }
];

<ThreadSection
  title="Today"
  threads={todayThreads}
  onThreadSelect={() => {}}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4 bg-sidebar">
          <ThreadSection title="Today" threads={todayThreads} onThreadSelect={() => {}} />
        </div>
      </ComponentExample>

      <ComponentExample
        name="With Active Thread"
        description="Thread section with one thread marked as active"
        code={`<ThreadSection
  title="Today"
  threads={todayThreads}
  activeThreadId="2"
  onThreadSelect={() => {}}
/>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4 bg-sidebar">
          <ThreadSection
            title="Today"
            threads={todayThreads}
            activeThreadId="2"
            onThreadSelect={() => {}}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        name="Multiple Thread Sections"
        description="Multiple thread sections organized by time period"
        code={`<div className="space-y-2">
  <ThreadSection
    title="Today"
    threads={todayThreads}
    activeThreadId="2"
    onThreadSelect={() => {}}
  />
  
  <ThreadSection
    title="Yesterday"
    threads={yesterdayThreads}
    onThreadSelect={() => {}}
  />
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden p-4 bg-sidebar">
          <div className="space-y-2">
            <ThreadSection
              title="Today"
              threads={todayThreads}
              activeThreadId="2"
              onThreadSelect={() => {}}
            />

            <ThreadSection title="Yesterday" threads={yesterdayThreads} onThreadSelect={() => {}} />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        name="In Sidebar Context"
        description="Thread sections used within a sidebar layout"
        code={`<div className="w-full max-w-md border rounded-lg overflow-hidden h-[500px] flex flex-col bg-sidebar">
  <div className="p-4 border-b">
    <h2 className="text-lg font-semibold">Conversations</h2>
    <div className="mt-2 relative">
      <input
        type="text"
        placeholder="Search conversations..."
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
    </div>
  </div>
  
  <div className="flex-1 overflow-y-auto p-2">
    <ThreadSection
      title="Today"
      threads={todayThreads}
      activeThreadId="2"
      onThreadSelect={() => {}}
    />
    
    <ThreadSection
      title="Yesterday"
      threads={yesterdayThreads}
      onThreadSelect={() => {}}
    />
  </div>
</div>`}
      >
        <div className="w-full max-w-md border rounded-lg overflow-hidden h-[500px] flex flex-col bg-sidebar">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <ThreadSection
              title="Today"
              threads={todayThreads}
              activeThreadId="2"
              onThreadSelect={() => {}}
            />

            <ThreadSection title="Yesterday" threads={yesterdayThreads} onThreadSelect={() => {}} />
          </div>
        </div>
      </ComponentExample>
    </div>
  );
};
