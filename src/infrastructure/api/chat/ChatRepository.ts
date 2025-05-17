import { UnauthorizedError } from '@/application/features/auth/errors';
import {
  ChatServerError,
  InvalidMessageError,
  InvalidTitleError,
  MessageNotFoundError,
  ModelNotEnabledError,
  ModelNotFoundError,
  RateLimitExceededError,
  ThreadNotFoundError,
} from '@/application/features/chat/errors/index';
import { IChatRepository } from '@/domain/interfaces/chat/IChatRepository';
import {
  ChatErrorCode,
  ChatMessage,
  ChatThread,
  EditMessageParams,
  SendMessageParams,
} from '@/domain/models/chat';
import { IHttpClient } from '@/infrastructure/utils/http/types';

import { BaseErrorResponse, BaseRepository, HttpStatusCode } from '../BaseRepository';

/**
 * Repository implementation for chat operations
 * Handles API communication and error mapping for chat features
 */
export class ChatRepository extends BaseRepository implements IChatRepository {
  private readonly baseUrl = '/api/chat';

  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  /**
   * Maps API error codes to domain-specific errors
   */
  protected override handleErrorCode(code: string, message: string): Error | null {
    switch (code) {
      case ChatErrorCode.INVALID_MESSAGE:
        return new InvalidMessageError(message);
      case ChatErrorCode.THREAD_NOT_FOUND:
        return new ThreadNotFoundError(message);
      case ChatErrorCode.MODEL_NOT_FOUND:
        return new ModelNotFoundError(message);
      case ChatErrorCode.MODEL_NOT_ENABLED:
        return new ModelNotEnabledError(message);
      case ChatErrorCode.RATE_LIMIT_EXCEEDED:
        return new RateLimitExceededError(message);
      case ChatErrorCode.SERVER_ERROR:
        return new ChatServerError(message);
      case ChatErrorCode.MESSAGE_NOT_FOUND:
        return new MessageNotFoundError(message);
      case ChatErrorCode.INVALID_TITLE:
        return new InvalidTitleError(message);
      default:
        return null;
    }
  }

  /**
   * Handles chat-specific error responses
   */
  protected override handleErrorResponse(errorData: BaseErrorResponse): Error {
    // First try error codes
    if (errorData.code) {
      const error = this.handleErrorCode(errorData.code, errorData.message);
      if (error) return error;
    }

    // Then handle specific status codes
    if (errorData.status) {
      switch (errorData.status) {
        case HttpStatusCode.BAD_REQUEST:
          return new InvalidMessageError(errorData.message || 'Invalid message format');
        case HttpStatusCode.NOT_FOUND:
          return new ThreadNotFoundError(errorData.message || 'Thread or model not found');
        case HttpStatusCode.TOO_MANY_REQUESTS:
          return new RateLimitExceededError(errorData.message || 'Rate limit exceeded');
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
          return new ChatServerError(errorData.message || 'Server error occurred');
      }
    }

    // Fallback to base error handling
    return super.handleErrorResponse(errorData);
  }

  /**
   * Validates message parameters before sending
   * @param params Message parameters to validate
   * @throws {InvalidMessageError} When validation fails
   */
  private validateMessage(params: SendMessageParams): void {
    if (!params.message || params.message.trim().length === 0) {
      throw new InvalidMessageError('Message content is required');
    }

    if (!params.modelId || params.modelId.trim().length === 0) {
      throw new InvalidMessageError('Model ID is required');
    }

    if (params.threadId !== undefined && params.threadId.trim().length === 0) {
      throw new InvalidMessageError('Thread ID cannot be empty if provided');
    }
  }

  /**
   * Validates edit message parameters
   * @param params Edit message parameters to validate
   * @throws {InvalidMessageError} When validation fails
   */
  private validateEditMessage(params: EditMessageParams): void {
    if (!params.threadId || params.threadId.trim().length === 0) {
      throw new InvalidMessageError('Thread ID is required');
    }

    if (!params.messageId || params.messageId.trim().length === 0) {
      throw new InvalidMessageError('Message ID is required');
    }

    if (!params.content || params.content.trim().length === 0) {
      throw new InvalidMessageError('Message content is required');
    }
  }

  /**
   * Validates a thread title
   * @param title The title to validate
   * @throws {InvalidTitleError} When validation fails
   */
  private validateThreadTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new InvalidTitleError('Thread title is required');
    }

    if (title.length > 255) {
      throw new InvalidTitleError('Thread title exceeds maximum length of 255 characters');
    }
  }

  /**
   * Maps errors to domain-specific errors for streaming operations
   * @param error The error to map
   * @returns A domain-specific error
   */
  private mapStreamingError(error: unknown): Error {
    // If it's already a domain error, return it
    if (
      error instanceof InvalidMessageError ||
      error instanceof InvalidTitleError ||
      error instanceof ThreadNotFoundError ||
      error instanceof ModelNotFoundError ||
      error instanceof ModelNotEnabledError ||
      error instanceof RateLimitExceededError ||
      error instanceof ChatServerError ||
      error instanceof UnauthorizedError
    ) {
      return error;
    }

    if (error instanceof Error) {
      // Try to parse error data from JSON string
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.status) {
          // Map status codes to domain errors
          switch (errorData.status) {
            case HttpStatusCode.BAD_REQUEST:
              return new InvalidMessageError(errorData.message || 'Invalid message format');
            case HttpStatusCode.UNAUTHORIZED:
              return new UnauthorizedError(errorData.message || 'Unauthorized');
            case HttpStatusCode.NOT_FOUND:
              return new ThreadNotFoundError(errorData.message || 'Thread or model not found');
            case HttpStatusCode.TOO_MANY_REQUESTS:
              return new RateLimitExceededError(errorData.message || 'Rate limit exceeded');
            case HttpStatusCode.INTERNAL_SERVER_ERROR:
              return new ChatServerError(errorData.message || 'Server error occurred');
          }
        }
      } catch {
        // Not a JSON string, continue with default handling
      }

      // Otherwise, wrap it in a ChatServerError
      return new ChatServerError(error.message);
    }

    // For unknown errors
    return new ChatServerError('Unknown error occurred');
  }

  /**
   * Gets an error code for a given error
   * @param error The error to get a code for
   * @returns The error code
   */
  private getErrorCodeFromError(error: Error): string {
    if (error instanceof InvalidMessageError) return ChatErrorCode.INVALID_MESSAGE;
    if (error instanceof InvalidTitleError) return ChatErrorCode.INVALID_TITLE;
    if (error instanceof ThreadNotFoundError) return ChatErrorCode.THREAD_NOT_FOUND;
    if (error instanceof ModelNotFoundError) return ChatErrorCode.MODEL_NOT_FOUND;
    if (error instanceof ModelNotEnabledError) return ChatErrorCode.MODEL_NOT_ENABLED;
    if (error instanceof RateLimitExceededError) return ChatErrorCode.RATE_LIMIT_EXCEEDED;
    if (error instanceof ChatServerError) return ChatErrorCode.SERVER_ERROR;
    if (error instanceof UnauthorizedError) return 'AUTH_001';
    return 'UNKNOWN_ERROR';
  }

  /**
   * Converts date strings to Date objects in chat messages
   * @param message The message to convert dates in
   * @returns The message with Date objects
   */
  private convertMessageDates(message: ChatMessage): ChatMessage {
    // Handle array content format - convert timestamp strings to Date objects in each content item
    const convertedContent = Array.isArray(message.content)
      ? message.content.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
      : message.content; // For backward compatibility with string content

    // Convert main message timestamp and return
    return {
      ...message,
      content: convertedContent,
      timestamp: new Date(message.timestamp),
    };
  }

  /**
   * Converts date strings to Date objects in chat threads
   * @param thread The thread to convert dates in
   * @returns The thread with Date objects
   */
  private convertThreadDates(thread: ChatThread): ChatThread {
    return {
      ...thread,
      createdAt: new Date(thread.createdAt),
      updatedAt: new Date(thread.updatedAt),
    };
  }

  /**
   * Sends a message to the AI model and gets a response
   * @param params Message parameters including model ID and content
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {InvalidMessageError} When message format is invalid
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {ModelNotFoundError} When model is not found
   * @throws {ModelNotEnabledError} When model is not enabled
   * @throws {RateLimitExceededError} When rate limit is exceeded
   * @throws {ChatServerError} When server encounters an error
   * @throws {NetworkError} When server is unreachable
   * @returns Promise resolving to the AI response message
   */
  async sendMessage(params: SendMessageParams): Promise<ChatMessage> {
    try {
      // Validate message parameters first
      this.validateMessage(params);

      const response = await this.httpClient.post<ChatMessage>(`${this.baseUrl}/messages`, params);
      return this.convertMessageDates(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Streams a message to the AI model and gets a response token by token
   * Uses the httpClient.postStream method to handle streaming
   *
   * @param params Message parameters including model ID and content
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {InvalidMessageError} When message format is invalid
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {ModelNotFoundError} When model is not found
   * @throws {ModelNotEnabledError} When model is not enabled
   * @throws {RateLimitExceededError} When rate limit is exceeded
   * @throws {ChatServerError} When server encounters an error
   * @throws {NetworkError} When server is unreachable
   * @returns Object containing an EventSource and an abort function
   */
  streamMessage(params: SendMessageParams): { eventSource: EventSource; abort: () => void } {
    try {
      // Validate message parameters first
      this.validateMessage(params);

      // Create a custom EventSource for type compatibility
      const eventSource = new EventSource('data:,');
      eventSource.close(); // Close it as we'll use it just for dispatching events

      // Create an abort controller for the stream
      const controller = new AbortController();

      // Track if abort has been called to prevent duplicate events
      let abortCalled = false;

      // Start the streaming request

      const abort = this.httpClient.postStream(
        `${this.baseUrl}/messages/stream`,
        params,
        this.createStreamOptions(eventSource, controller)
      );

      // Return the EventSource and abort function
      return {
        eventSource,
        abort: () => {
          // Only proceed if abort hasn't been called yet
          if (abortCalled) {
            return;
          }

          abortCalled = true;

          // First dispatch an abort event to notify listeners
          try {
            if (eventSource.readyState !== EventSource.CLOSED) {
              const abortEvent = new MessageEvent('error', {
                data: JSON.stringify({
                  error: 'Stream aborted by user',
                  code: 'USER_ABORT',
                }),
              });
              eventSource.dispatchEvent(abortEvent);

              eventSource.close();
            }
          } catch (e) {
            console.error('Error during EventSource cleanup:', e);
          }

          // Then call the underlying abort function

          abort();
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Creates stream options for the HTTP client
   * @param eventSource The EventSource to dispatch events to
   * @param controller The AbortController for the stream
   * @returns Stream options for the HTTP client
   */
  private createStreamOptions(eventSource: EventSource, controller: AbortController) {
    return {
      signal: controller.signal,
      onStart: () => {
        // Dispatch start event
        const startEvent = new MessageEvent('start', {
          data: JSON.stringify({ status: 'started' }),
        });
        eventSource.dispatchEvent(startEvent);
      },
      onChunk: (data: string) => {
        try {
          // Parse the data
          const jsonData = JSON.parse(data);

          if (jsonData.token !== undefined) {
            // Token event - dispatch a token with the content
            const tokenEvent = new MessageEvent('token', { data });
            eventSource.dispatchEvent(tokenEvent);
          } else if (jsonData.toolCallId && jsonData.toolName) {
            if (jsonData.args) {
              // Tool call event - dispatch a tool call event
              const toolCallEvent = new MessageEvent('tool-call', { data });
              eventSource.dispatchEvent(toolCallEvent);
            } else if (jsonData.result) {
              // Tool result event - dispatch a tool result event
              const toolResultEvent = new MessageEvent('tool-result', { data });
              eventSource.dispatchEvent(toolResultEvent);
            }
          } else if (jsonData.threadId && jsonData.messageId) {
            // Done event - dispatch completion and close the stream
            const doneEvent = new MessageEvent('done', { data });
            eventSource.dispatchEvent(doneEvent);
            eventSource.close();
          }
        } catch (e) {
          console.error('Error parsing event data:', e);
        }
      },
      onError: (error: Error) => {
        // Map the error to domain-specific errors
        const mappedError = this.mapStreamingError(error);

        // Dispatch error event
        const errorEvent = new MessageEvent('error', {
          data: JSON.stringify({
            error: mappedError.message,
            code: this.getErrorCodeFromError(mappedError),
          }),
        });

        eventSource.dispatchEvent(errorEvent);
        eventSource.close();
      },
      onComplete: () => {
        // If the stream completes without a done event, dispatch an error
        if (eventSource.readyState !== EventSource.CLOSED) {
          const errorEvent = new MessageEvent('error', {
            data: JSON.stringify({
              error: 'Stream ended unexpectedly',
              code: 'STREAM_ENDED',
            }),
          });
          eventSource.dispatchEvent(errorEvent);
          eventSource.close();
        }
      },
    };
  }

  /**
   * Gets all chat threads for the current user
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ChatServerError} When server encounters an error
   * @throws {NetworkError} When server is unreachable
   * @returns Promise resolving to an array of chat threads
   */
  async getThreads(): Promise<ChatThread[]> {
    try {
      const response = await this.httpClient.get<ChatThread[]>(`${this.baseUrl}/threads`);
      return response.map((thread) => this.convertThreadDates(thread));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gets a specific chat thread with all its messages
   * @param threadId ID of the thread to retrieve
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {ChatServerError} When server encounters an error
   * @throws {NetworkError} When server is unreachable
   * @returns Promise resolving to the thread and its messages
   */
  async getThread(threadId: string): Promise<{
    thread: ChatThread;
    messages: ChatMessage[];
  }> {
    try {
      const response = await this.httpClient.get<{
        thread: ChatThread;
        messages: ChatMessage[];
      }>(`${this.baseUrl}/threads/${threadId}`);

      return {
        thread: this.convertThreadDates(response.thread),
        messages: response.messages.map((message) => this.convertMessageDates(message)),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submits user feedback for an AI message
   * @param messageId ID of the message to provide feedback for
   * @param rating The feedback rating ('positive' for thumbs up, 'negative' for thumbs down)
   * @param comment Optional comment with the feedback
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When feedback format is invalid
   * @throws {MessageNotFoundError} When message is not found
   * @throws {ChatServerError} When server encounters an error
   * @throws {NetworkError} When server is unreachable
   * @returns Promise resolving when feedback is submitted successfully
   */
  async submitFeedback(
    messageId: string,
    rating: 'positive' | 'negative',
    comment?: string
  ): Promise<void> {
    try {
      // Validate feedback parameters
      if (!messageId || messageId.trim().length === 0) {
        throw new InvalidMessageError('Message ID is required');
      }

      if (rating !== 'positive' && rating !== 'negative') {
        throw new InvalidMessageError('Rating must be either "positive" or "negative"');
      }

      // Prepare the request payload
      const payload = {
        messageId,
        rating,
        comment: comment || '',
      };

      // Send the feedback
      await this.httpClient.post(`${this.baseUrl}/messages/feedback`, payload);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Edits an existing message and streams the updated AI response
   * All messages after the edited message will be deleted
   * @param params Edit message parameters including thread ID, message ID and new content
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When message format is invalid
   * @throws {NotFoundError} When thread or message is not found
   * @returns Object containing an EventSource for streaming and an abort function
   */
  editMessage(params: EditMessageParams): { eventSource: EventSource; abort: () => void } {
    try {
      // Validate edit message parameters first
      this.validateEditMessage(params);

      // Create a custom EventSource for type compatibility
      const eventSource = new EventSource('data:,');
      eventSource.close(); // Close it as we'll use it just for dispatching events

      // Create an abort controller for the stream
      const controller = new AbortController();

      // Track if abort has been called to prevent duplicate events
      let abortCalled = false;

      // Start the streaming request
      const abort = this.httpClient.putStream(
        `${this.baseUrl}/threads/${params.threadId}/messages/${params.messageId}/stream`,
        {
          content: params.content,
          modelId: params.modelId,
        },
        this.createStreamOptions(eventSource, controller)
      );

      // Return the EventSource and abort function
      return {
        eventSource,
        abort: () => {
          // Only proceed if abort hasn't been called yet
          if (abortCalled) {
            return;
          }

          abortCalled = true;

          // First dispatch an abort event to notify listeners
          try {
            if (eventSource.readyState !== EventSource.CLOSED) {
              const abortEvent = new MessageEvent('error', {
                data: JSON.stringify({
                  error: 'Stream aborted by user',
                  code: 'USER_ABORT',
                }),
              });
              eventSource.dispatchEvent(abortEvent);

              eventSource.close();
            }
          } catch (e) {
            console.error('Error during EventSource cleanup:', e);
          }

          // Then call the underlying abort function
          abort();
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Renames a chat thread title
   * @param threadId ID of the thread to rename
   * @param newTitle New title for the thread
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When title format is invalid
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {ChatServerError} When server encounters an error
   * @throws {NetworkError} When server is unreachable
   * @returns Promise resolving to the updated chat thread
   */
  async renameThread(threadId: string, newTitle: string): Promise<ChatThread> {
    try {
      this.validateThreadTitle(newTitle);

      const response = await this.httpClient.patch<ChatThread>(
        `${this.baseUrl}/threads/${threadId}/title`,
        {
          newTitle,
        }
      );

      return this.convertThreadDates(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Deletes a chat thread
   * @param threadId ID of the thread to delete
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {NotFoundError} When thread is not found
   * @throws {ForbiddenError} When user doesn't own the thread
   * @returns Promise resolving when thread is deleted successfully
   */
  async deleteThread(threadId: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.baseUrl}/threads/${threadId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Updates the model used in a chat thread
   * @inheritdoc
   */
  async updateThreadModel(threadId: string, modelId: string): Promise<ChatThread> {
    try {
      // Validate inputs
      if (!threadId || threadId.trim().length === 0) {
        throw new InvalidMessageError('Thread ID is required');
      }

      if (!modelId || modelId.trim().length === 0) {
        throw new InvalidMessageError('Model ID is required');
      }

      // Make API request
      const response = await this.httpClient.put<ChatThread>(
        `${this.baseUrl}/threads/${threadId}/model`,
        { modelId }
      );

      // Convert date strings to Date objects
      return this.convertThreadDates(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
