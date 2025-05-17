import { v4 as uuidv4 } from 'uuid';

import { ChatMessage, ChatThread } from '../types/chat';

// Define a feedback interface
interface MessageFeedback {
  messageId: string;
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: string;
}

class ChatStore {
  private messages: Map<string, ChatMessage>;
  private threads: Map<string, ChatThread>;
  private feedback: Map<string, MessageFeedback>; // Map messageId -> feedback
  private static STORAGE_KEYS = {
    MESSAGES: 'mock_chat_messages',
    THREADS: 'mock_chat_threads',
    FEEDBACK: 'mock_chat_feedback',
  };

  constructor() {
    this.messages = this.loadMessages() || new Map();
    this.threads = this.loadThreads() || new Map();
    this.feedback = this.loadFeedback() || new Map();
  }

  // Message operations
  async createMessage(
    content: string,
    threadId: string,
    role: 'user' | 'assistant'
  ): Promise<ChatMessage> {
    const timestamp = new Date().toISOString();
    const textContent = {
      type: 'text',
      text: content,
      timestamp,
    };

    const message: ChatMessage = {
      id: uuidv4(),
      content: [textContent], // Use array of content objects
      threadId,
      timestamp,
      role,
    };

    this.messages.set(message.id, message);
    this.persistMessages();
    return message;
  }

  async getMessage(id: string): Promise<ChatMessage | undefined> {
    return this.messages.get(id);
  }

  async getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    return Array.from(this.messages.values()).filter((msg) => msg.threadId === threadId);
  }

  // Thread operations
  async createThread(modelId: string, title: string, userId: string): Promise<ChatThread> {
    const thread: ChatThread = {
      id: uuidv4(),
      title,
      modelId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.threads.set(thread.id, thread);
    this.persistThreads();
    return thread;
  }

  async getThread(id: string): Promise<ChatThread | undefined> {
    return this.threads.get(id);
  }

  async getAllThreads(userId: string): Promise<ChatThread[]> {
    return Array.from(this.threads.values()).filter((thread) => thread.userId === userId);
  }

  async updateThread(id: string, updates: Partial<ChatThread>): Promise<ChatThread> {
    const thread = this.threads.get(id);
    if (!thread) {
      throw new Error('Thread not found');
    }

    const updatedThread = {
      ...thread,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.threads.set(id, updatedThread);
    this.persistThreads();
    return updatedThread;
  }

  /**
   * Deletes a thread and all its messages
   * @param id ID of the thread to delete
   * @throws Error when thread is not found
   */
  async deleteThread(id: string): Promise<void> {
    const thread = this.threads.get(id);
    if (!thread) {
      throw new Error('Thread not found');
    }

    // Delete the thread
    this.threads.delete(id);
    this.persistThreads();

    // Delete all messages associated with this thread
    const threadMessages = await this.getThreadMessages(id);
    threadMessages.forEach((message) => {
      this.messages.delete(message.id);

      // Also remove any feedback for these messages
      if (this.feedback.has(message.id)) {
        this.feedback.delete(message.id);
      }
    });

    this.persistMessages();
    this.persistFeedback();
  }

  // Feedback operations
  async submitFeedback(
    messageId: string,
    rating: 'positive' | 'negative',
    comment?: string
  ): Promise<void> {
    // Check if message exists
    const message = await this.getMessage(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Store the feedback
    const feedback: MessageFeedback = {
      messageId,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    this.feedback.set(messageId, feedback);
    this.persistFeedback();
  }

  async getFeedback(messageId: string): Promise<MessageFeedback | undefined> {
    return this.feedback.get(messageId);
  }

  // Storage operations
  private loadMessages(): Map<string, ChatMessage> | undefined {
    try {
      const data = localStorage.getItem(ChatStore.STORAGE_KEYS.MESSAGES);
      if (!data) return undefined;
      return new Map(JSON.parse(data));
    } catch (error) {
      console.warn('Failed to load chat messages from storage:', error);
      return undefined;
    }
  }

  private loadThreads(): Map<string, ChatThread> | undefined {
    try {
      const data = localStorage.getItem(ChatStore.STORAGE_KEYS.THREADS);
      if (!data) return undefined;
      return new Map(JSON.parse(data));
    } catch (error) {
      console.warn('Failed to load chat threads from storage:', error);
      return undefined;
    }
  }

  private loadFeedback(): Map<string, MessageFeedback> | undefined {
    try {
      const data = localStorage.getItem(ChatStore.STORAGE_KEYS.FEEDBACK);
      if (!data) return undefined;
      return new Map(JSON.parse(data));
    } catch (error) {
      console.warn('Failed to load chat feedback from storage:', error);
      return undefined;
    }
  }

  private persistMessages(): void {
    try {
      localStorage.setItem(
        ChatStore.STORAGE_KEYS.MESSAGES,
        JSON.stringify(Array.from(this.messages.entries()))
      );
    } catch (error) {
      console.error('Failed to persist chat messages:', error);
    }
  }

  private persistThreads(): void {
    try {
      localStorage.setItem(
        ChatStore.STORAGE_KEYS.THREADS,
        JSON.stringify(Array.from(this.threads.entries()))
      );
    } catch (error) {
      console.error('Failed to persist chat threads:', error);
    }
  }

  private persistFeedback(): void {
    try {
      localStorage.setItem(
        ChatStore.STORAGE_KEYS.FEEDBACK,
        JSON.stringify(Array.from(this.feedback.entries()))
      );
    } catch (error) {
      console.error('Failed to persist chat feedback to storage:', error);
    }
  }
}

// Export singleton instance
export const chatStore = new ChatStore();
