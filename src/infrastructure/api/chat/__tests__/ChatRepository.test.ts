/**
 * Tests for ChatRepository which handles chat-related API calls.
 * Verifies proper HTTP client usage, request/response handling, and error scenarios.
 */
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ChatServerError,
  ModelNotEnabledError,
  ModelNotFoundError,
  RateLimitExceededError,
  ThreadNotFoundError,
} from '../../../../application/features/chat/errors';
import { ChatMessage, ChatThread } from '../../../../domain/models/chat/types';
import { FetchHttpClient } from '../../../utils/http/FetchHttpClient';
import { server } from '../../mock/server';
import { ChatRepository } from '../ChatRepository';

describe('Infrastructure > API > Chat > ChatRepository', () => {
  let repository: ChatRepository;
  let httpClient: FetchHttpClient;

  // Test Data Factories
  const createChatMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
    id: 'message-1',
    threadId: 'thread-1',
    role: 'user',
    content: 'Hello, how are you?',
    timestamp: new Date('2023-01-01T12:00:00Z'),
    ...overrides,
  });

  const createChatThread = (overrides: Partial<ChatThread> = {}): ChatThread => ({
    id: 'thread-1',
    title: 'Chat Thread 1',
    modelId: 'model-1',
    userId: 'user-1',
    createdAt: new Date('2023-01-01T12:00:00Z'),
    updatedAt: new Date('2023-01-01T12:00:00Z'),
    ...overrides,
  });

  const createThreadResponse = (overrides = {}) => ({
    thread: createChatThread(),
    messages: [createChatMessage()],
    ...overrides,
  });

  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'error' });
    httpClient = new FetchHttpClient('', async () => 'refresh-token');
    repository = new ChatRepository(httpClient);
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  /**
   * Tests proper HTTP client initialization and method calls
   */
  describe('HTTP Client Integration', () => {
    it('should properly initialize and use HTTP client', async () => {
      const mockHttpClient = {
        get: vi.fn().mockImplementation((url) => {
          if (url === '/api/chat/threads') {
            return Promise.resolve([]);
          } else if (url.includes('/api/chat/threads/')) {
            return Promise.resolve({
              thread: {
                id: 'thread-1',
                title: 'Test Thread',
                modelId: 'model-1',
                userId: 'user-1',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z',
              },
              messages: [],
            });
          }
          return Promise.resolve([]);
        }),
        put: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
        patch: vi.fn().mockResolvedValue({}),
        postStream: vi.fn().mockReturnValue(() => {}),
        putStream: vi.fn().mockReturnValue(() => {}),
      };

      const testRepo = new ChatRepository(mockHttpClient);

      // Test sendMessage
      await testRepo.sendMessage({
        threadId: 'thread-1',
        modelId: 'model-1',
        message: 'Hello',
      });
      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/chat/messages', {
        threadId: 'thread-1',
        modelId: 'model-1',
        message: 'Hello',
      });

      // Test getThreads
      await testRepo.getThreads();
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/chat/threads');

      // Test getThread
      await testRepo.getThread('thread-1');
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/chat/threads/thread-1');

      // Test deleteThread
      await testRepo.deleteThread('thread-1');
      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/chat/threads/thread-1');
    });
  });

  /**
   * Tests sendMessage endpoint functionality
   */
  describe('sendMessage', () => {
    it('should send a message and return the response', async () => {
      const message = createChatMessage({ role: 'assistant' });

      server.use(
        http.post('/api/chat/messages', () => {
          return HttpResponse.json(message);
        })
      );

      const result = await repository.sendMessage({
        threadId: 'thread-1',
        modelId: 'model-1',
        message: 'Hello',
      });

      expect(result).toEqual({
        ...message,
        timestamp: new Date(message.timestamp),
      });
    });

    it('should handle thread not found error', async () => {
      server.use(
        http.post('/api/chat/messages', () => {
          return HttpResponse.json(
            { message: 'Thread not found', code: 'CHAT_002' },
            { status: 404 }
          );
        })
      );

      await expect(
        repository.sendMessage({
          threadId: 'non-existent',
          modelId: 'model-1',
          message: 'Hello',
        })
      ).rejects.toThrow(ThreadNotFoundError);
    });

    it('should handle model not found error', async () => {
      server.use(
        http.post('/api/chat/messages', () => {
          return HttpResponse.json(
            { message: 'Model not found', code: 'CHAT_003' },
            { status: 404 }
          );
        })
      );

      await expect(
        repository.sendMessage({
          threadId: 'thread-1',
          modelId: 'non-existent',
          message: 'Hello',
        })
      ).rejects.toThrow(ModelNotFoundError);
    });

    it('should handle model not enabled error', async () => {
      server.use(
        http.post('/api/chat/messages', () => {
          return HttpResponse.json(
            { message: 'Model not enabled', code: 'CHAT_004' },
            { status: 403 }
          );
        })
      );

      await expect(
        repository.sendMessage({
          threadId: 'thread-1',
          modelId: 'disabled-model',
          message: 'Hello',
        })
      ).rejects.toThrow(ModelNotEnabledError);
    });

    it('should handle rate limit exceeded error', async () => {
      server.use(
        http.post('/api/chat/messages', () => {
          return HttpResponse.json(
            { message: 'Rate limit exceeded', code: 'CHAT_005' },
            { status: 429 }
          );
        })
      );

      await expect(
        repository.sendMessage({
          threadId: 'thread-1',
          modelId: 'model-1',
          message: 'Hello',
        })
      ).rejects.toThrow(RateLimitExceededError);
    });

    it('should handle server error', async () => {
      server.use(
        http.post('/api/chat/messages', () => {
          return HttpResponse.json({ message: 'Server error', code: 'CHAT_500' }, { status: 500 });
        })
      );

      await expect(
        repository.sendMessage({
          threadId: 'thread-1',
          modelId: 'model-1',
          message: 'Hello',
        })
      ).rejects.toThrow(ChatServerError);
    });
  });

  /**
   * Tests getThreads endpoint functionality
   */
  describe('getThreads', () => {
    it('should get all threads and return them', async () => {
      const threads = [createChatThread({ id: 'thread-1' }), createChatThread({ id: 'thread-2' })];

      server.use(
        http.get('/api/chat/threads', () => {
          return HttpResponse.json(threads);
        })
      );

      const result = await repository.getThreads();

      expect(result).toEqual(
        threads.map((thread) => ({
          ...thread,
          createdAt: new Date(thread.createdAt),
          updatedAt: new Date(thread.updatedAt),
        }))
      );
    });

    it('should handle server error', async () => {
      server.use(
        http.get('/api/chat/threads', () => {
          return HttpResponse.json({ message: 'Server error', code: 'CHAT_500' }, { status: 500 });
        })
      );

      await expect(repository.getThreads()).rejects.toThrow(ChatServerError);
    });
  });

  /**
   * Tests getThread endpoint functionality
   */
  describe('getThread', () => {
    it('should get a thread and its messages', async () => {
      const response = createThreadResponse();

      server.use(
        http.get('/api/chat/threads/:threadId', () => {
          return HttpResponse.json(response);
        })
      );

      const result = await repository.getThread('thread-1');

      expect(result).toEqual({
        thread: {
          ...response.thread,
          createdAt: new Date(response.thread.createdAt),
          updatedAt: new Date(response.thread.updatedAt),
        },
        messages: response.messages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      });
    });

    it('should handle thread not found error', async () => {
      server.use(
        http.get('/api/chat/threads/:threadId', () => {
          return HttpResponse.json(
            { message: 'Thread not found', code: 'CHAT_002' },
            { status: 404 }
          );
        })
      );

      await expect(repository.getThread('non-existent')).rejects.toThrow(ThreadNotFoundError);
    });

    it('should handle server error', async () => {
      server.use(
        http.get('/api/chat/threads/:threadId', () => {
          return HttpResponse.json({ message: 'Server error', code: 'CHAT_500' }, { status: 500 });
        })
      );

      await expect(repository.getThread('thread-1')).rejects.toThrow(ChatServerError);
    });
  });

  /**
   * Tests editMessage endpoint functionality
   */
  describe('editMessage', () => {
    it('should validate edit message parameters', () => {
      // Test missing thread ID
      expect(() =>
        repository.editMessage({
          threadId: '',
          messageId: 'message-1',
          content: 'Updated content',
          modelId: 'model-1',
        })
      ).toThrow('Thread ID is required');

      // Test missing message ID
      expect(() =>
        repository.editMessage({
          threadId: 'thread-1',
          messageId: '',
          content: 'Updated content',
          modelId: 'model-1',
        })
      ).toThrow('Message ID is required');

      // Test empty content
      expect(() =>
        repository.editMessage({
          threadId: 'thread-1',
          messageId: 'message-1',
          content: '',
          modelId: 'model-1',
        })
      ).toThrow('Message content is required');
    });

    // Skip tests that require EventSource which is not available in the test environment
    it.skip('should handle thread not found error - skipped due to EventSource not being available in test environment', async () => {
      server.use(
        http.put('/api/chat/threads/:threadId/messages/:messageId/stream', () => {
          return HttpResponse.json(
            { message: 'Thread not found', code: 'CHAT_002' },
            { status: 404 }
          );
        })
      );

      const { eventSource } = repository.editMessage({
        threadId: 'non-existent',
        messageId: 'message-1',
        content: 'Updated content',
        modelId: 'model-1',
      });

      // Wait for error event
      await new Promise<void>((resolve) => {
        eventSource.addEventListener('error', (event) => {
          const data = JSON.parse((event as MessageEvent).data);
          expect(data.code).toBe('CHAT_002');
          resolve();
        });
      });
    });

    it.skip('should handle message not found error - skipped due to EventSource not being available in test environment', async () => {
      server.use(
        http.put('/api/chat/threads/:threadId/messages/:messageId/stream', () => {
          return HttpResponse.json(
            { message: 'Message not found', code: 'CHAT_006' },
            { status: 404 }
          );
        })
      );

      const { eventSource } = repository.editMessage({
        threadId: 'thread-1',
        messageId: 'non-existent',
        content: 'Updated content',
        modelId: 'model-1',
      });

      // Wait for error event
      await new Promise<void>((resolve) => {
        eventSource.addEventListener('error', (event) => {
          const data = JSON.parse((event as MessageEvent).data);
          expect(data.code).toBe('CHAT_006');
          resolve();
        });
      });
    });

    it.skip('should handle server error - skipped due to EventSource not being available in test environment', async () => {
      server.use(
        http.put('/api/chat/threads/:threadId/messages/:messageId/stream', () => {
          return HttpResponse.json({ message: 'Server error', code: 'CHAT_500' }, { status: 500 });
        })
      );

      const { eventSource } = repository.editMessage({
        threadId: 'thread-1',
        messageId: 'message-1',
        content: 'Updated content',
        modelId: 'model-1',
      });

      // Wait for error event
      await new Promise<void>((resolve) => {
        eventSource.addEventListener('error', (event) => {
          const data = JSON.parse((event as MessageEvent).data);
          expect(data.code).toBe('CHAT_500');
          resolve();
        });
      });
    });

    it.skip('should handle successful edit and streaming - skipped due to EventSource not being available in test environment', async () => {
      server.use(
        http.put('/api/chat/threads/:threadId/messages/:messageId/stream', () => {
          return HttpResponse.json({ token: 'Hello', done: false });
        })
      );

      const { eventSource } = repository.editMessage({
        threadId: 'thread-1',
        messageId: 'message-1',
        content: 'Updated content',
        modelId: 'model-1',
      });

      // Wait for token event
      await new Promise<void>((resolve) => {
        eventSource.addEventListener('token', (event) => {
          const data = JSON.parse((event as MessageEvent).data);
          expect(data.token).toBe('Hello');
          resolve();
        });
      });
    });

    it.skip('should handle abort - skipped due to EventSource not being available in test environment', async () => {
      server.use(
        http.put('/api/chat/threads/:threadId/messages/:messageId/stream', () => {
          return HttpResponse.json({ token: 'Hello', done: false });
        })
      );

      const { eventSource, abort } = repository.editMessage({
        threadId: 'thread-1',
        messageId: 'message-1',
        content: 'Updated content',
        modelId: 'model-1',
      });

      // Wait for abort event
      const abortPromise = new Promise<void>((resolve) => {
        eventSource.addEventListener('error', (event) => {
          const data = JSON.parse((event as MessageEvent).data);
          expect(data.code).toBe('USER_ABORT');
          resolve();
        });
      });

      // Call abort
      abort();

      await abortPromise;
    });
  });

  /**
   * Tests deleteThread endpoint functionality
   */
  describe('deleteThread', () => {
    it('should successfully delete a thread', async () => {
      server.use(
        http.delete('/api/chat/threads/:threadId', () => {
          return new HttpResponse(null, { status: 204 });
        })
      );

      await expect(repository.deleteThread('thread-1')).resolves.not.toThrow();
    });

    it('should handle thread not found error', async () => {
      server.use(
        http.delete('/api/chat/threads/:threadId', () => {
          return HttpResponse.json(
            { message: 'Thread not found', code: 'CHAT_002' },
            { status: 404 }
          );
        })
      );

      await expect(repository.deleteThread('non-existent')).rejects.toThrow(ThreadNotFoundError);
    });

    it('should handle unauthorized thread access error', async () => {
      server.use(
        http.delete('/api/chat/threads/:threadId', () => {
          return HttpResponse.json(
            { message: 'You do not have permission to access this thread', code: 'CHAT_403' },
            { status: 403 }
          );
        })
      );

      await expect(repository.deleteThread('unauthorized-thread')).rejects.toThrow();
    });

    it('should handle server error', async () => {
      server.use(
        http.delete('/api/chat/threads/:threadId', () => {
          return HttpResponse.json({ message: 'Server error', code: 'CHAT_500' }, { status: 500 });
        })
      );

      await expect(repository.deleteThread('thread-1')).rejects.toThrow(ChatServerError);
    });
  });

  /**
   * Tests updateThreadModel endpoint functionality
   */
  describe('updateThreadModel', () => {
    it('should update thread model successfully', async () => {
      const updatedThread = createChatThread({
        modelId: 'model-2', // Updated model ID
        updatedAt: new Date('2023-01-02T12:00:00Z'), // More recent date
      });

      server.use(
        http.put('/api/chat/threads/thread-1/model', () => {
          return HttpResponse.json({
            ...updatedThread,
            createdAt: updatedThread.createdAt.toISOString(),
            updatedAt: updatedThread.updatedAt.toISOString(),
          });
        })
      );

      const result = await repository.updateThreadModel('thread-1', 'model-2');

      expect(result).toEqual(updatedThread);
    });

    it('should validate thread ID before making request', async () => {
      await expect(repository.updateThreadModel('', 'model-2')).rejects.toThrow(
        'Thread ID is required'
      );
    });

    it('should validate model ID before making request', async () => {
      await expect(repository.updateThreadModel('thread-1', '')).rejects.toThrow(
        'Model ID is required'
      );
    });

    it('should handle thread not found error', async () => {
      server.use(
        http.put('/api/chat/threads/non-existent/model', () => {
          return HttpResponse.json(
            { message: 'Thread not found', code: 'CHAT_002' },
            { status: 404 }
          );
        })
      );

      await expect(repository.updateThreadModel('non-existent', 'model-2')).rejects.toThrow(
        ThreadNotFoundError
      );
    });

    it('should handle model not found error', async () => {
      server.use(
        http.put('/api/chat/threads/thread-1/model', () => {
          return HttpResponse.json(
            { message: 'Model not found', code: 'CHAT_003' },
            { status: 404 }
          );
        })
      );

      await expect(repository.updateThreadModel('thread-1', 'non-existent')).rejects.toThrow(
        ModelNotFoundError
      );
    });

    it('should handle server errors', async () => {
      server.use(
        http.put('/api/chat/threads/thread-1/model', () => {
          return HttpResponse.json(
            { message: 'Internal server error', code: 'CHAT_500' },
            { status: 500 }
          );
        })
      );

      await expect(repository.updateThreadModel('thread-1', 'model-2')).rejects.toThrow(
        ChatServerError
      );
    });
  });
});
