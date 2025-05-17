import {
  ChatMessage,
  ChatThread,
  EditMessageParams,
  SendMessageParams,
} from '@/domain/models/chat';

/**
 * Repository interface for chat operations
 * Defines the contract for chat-related data access
 */
export interface IChatRepository {
  /**
   * Sends a message and gets AI response
   * @param params Message parameters including model ID and content
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When message format is invalid
   * @throws {NotFoundError} When thread or model is not found
   * @returns Promise resolving to the AI response message
   */
  sendMessage(params: SendMessageParams): Promise<ChatMessage>;

  /**
   * Streams a message to the AI model and gets a response token by token
   * @param params Message parameters including model ID and content
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When message format is invalid
   * @throws {NotFoundError} When thread or model is not found
   * @returns Object containing an EventSource and an abort function
   */
  streamMessage(params: SendMessageParams): { eventSource: EventSource; abort: () => void };

  /**
   * Gets all chat threads for the current user
   * @throws {UnauthorizedError} When authentication is invalid
   * @returns Promise resolving to an array of chat threads
   */
  getThreads(): Promise<ChatThread[]>;

  /**
   * Gets a specific chat thread with all its messages
   * @param threadId ID of the thread to retrieve
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {NotFoundError} When thread is not found
   * @returns Promise resolving to the thread and its messages
   */
  getThread(threadId: string): Promise<{
    thread: ChatThread;
    messages: ChatMessage[];
  }>;

  /**
   * Submits user feedback for an AI message
   * @param messageId ID of the message to provide feedback for
   * @param rating The feedback rating ('positive' for thumbs up, 'negative' for thumbs down)
   * @param comment Optional comment with the feedback
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When feedback format is invalid
   * @throws {NotFoundError} When message is not found
   * @returns Promise resolving when feedback is submitted successfully
   */
  submitFeedback(
    messageId: string,
    rating: 'positive' | 'negative',
    comment?: string
  ): Promise<void>;

  /**
   * Edits an existing message and streams the updated AI response
   * All messages after the edited message will be deleted
   * @param params Edit message parameters including thread ID, message ID and new content
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When message format is invalid
   * @throws {NotFoundError} When thread or message is not found
   * @returns Object containing an EventSource for streaming and an abort function
   */
  editMessage(params: EditMessageParams): { eventSource: EventSource; abort: () => void };

  /**
   * Renames a chat thread title
   * @param threadId ID of the thread to rename
   * @param newTitle New title for the thread
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When title format is invalid
   * @throws {NotFoundError} When thread is not found
   * @returns Promise resolving to the updated chat thread
   */
  renameThread(threadId: string, newTitle: string): Promise<ChatThread>;

  /**
   * Deletes a chat thread
   * @param threadId ID of the thread to delete
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {NotFoundError} When thread is not found or doesn't exist
   * @throws {ForbiddenError} When user doesn't own the thread
   * @returns Promise resolving when thread is deleted successfully
   */
  deleteThread(threadId: string): Promise<void>;

  /**
   * Updates the model used in a chat thread
   * @param threadId ID of the thread to update
   * @param modelId New model ID to use for the thread
   * @throws {UnauthorizedError} When authentication is invalid
   * @throws {ValidationError} When model ID is invalid
   * @throws {NotFoundError} When thread is not found
   * @throws {ForbiddenError} When user doesn't own the thread
   * @returns Promise resolving to the updated chat thread
   */
  updateThreadModel(threadId: string, modelId: string): Promise<ChatThread>;
}
