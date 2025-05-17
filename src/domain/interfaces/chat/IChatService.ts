import {
  ChatMessageEntity,
  ChatThreadEntity,
  EditMessageParams,
  RenameThreadParams,
  SendMessageParams,
  UpdateThreadModelParams,
} from '@/domain/models/chat';

/**
 * Service interface for chat operations
 * Defines the contract for chat-related business logic
 */
export interface IChatService {
  /**
   * Sends a message to the AI model and gets a response
   * Handles thread creation/management and message validation
   *
   * @param params Message parameters including model ID and content
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {InvalidMessageError} When message format or content is invalid
   * @throws {ThreadNotFoundError} When continuing a non-existent thread
   * @throws {ModelNotFoundError} When specified model is not found or unavailable
   * @returns Promise resolving to the chat message entity
   */
  sendMessage(params: SendMessageParams): Promise<ChatMessageEntity>;

  /**
   * Streams a message to the AI model and gets a response token by token
   * Handles thread creation/management and message validation
   *
   * @param params Message parameters including model ID and content
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {InvalidMessageError} When message format or content is invalid
   * @throws {ThreadNotFoundError} When continuing a non-existent thread
   * @throws {ModelNotFoundError} When specified model is not found or unavailable
   * @returns Object containing an EventSource for streaming and an abort function
   */
  streamMessage(params: SendMessageParams): { eventSource: EventSource; abort: () => void };

  /**
   * Validates message parameters before sending
   * Ensures message content and model selection are valid
   *
   * @param params Message parameters to validate
   * @throws {InvalidMessageError} When validation fails
   */
  validateMessage(params: SendMessageParams): void;

  /**
   * Gets all chat threads for the current user
   *
   * @throws {UnauthorizedError} When user is not authenticated
   * @returns Promise resolving to an array of chat thread entities
   */
  getThreads(): Promise<ChatThreadEntity[]>;

  /**
   * Gets a specific chat thread with all its messages
   *
   * @param threadId ID of the thread to retrieve
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {ThreadNotFoundError} When thread is not found
   * @returns Promise resolving to the thread and its messages as entities
   */
  getThread(threadId: string): Promise<{
    thread: ChatThreadEntity;
    messages: ChatMessageEntity[];
  }>;

  /**
   * Submits user feedback for an AI message
   *
   * @param messageId ID of the message to provide feedback for
   * @param rating The feedback rating ('positive' for thumbs up, 'negative' for thumbs down)
   * @param comment Optional comment with the feedback
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {MessageNotFoundError} When message is not found
   * @returns Promise resolving when feedback is submitted successfully
   */
  submitFeedback(
    messageId: string,
    rating: 'positive' | 'negative',
    comment: string
  ): Promise<void>;

  /**
   * Edits an existing message and streams the updated AI response
   * All messages after the edited message will be deleted
   * Handles message validation and thread management
   *
   * @param params Edit message parameters including thread ID, message ID and new content
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {InvalidMessageError} When message format or content is invalid
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {MessageNotFoundError} When message is not found
   * @returns Object containing an EventSource for streaming and an abort function
   */
  editMessage(params: EditMessageParams): { eventSource: EventSource; abort: () => void };

  /**
   * Validates edit message parameters
   * Ensures message content is valid and message exists in thread
   *
   * @param params Edit message parameters to validate
   * @throws {InvalidMessageError} When validation fails
   */
  validateEditMessage(params: EditMessageParams): void;

  /**
   * Renames a chat thread
   *
   * @param params The parameters for renaming the thread
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {InvalidTitleError} When title is invalid
   * @returns Promise resolving to the updated thread entity
   */
  renameThread(params: RenameThreadParams): Promise<ChatThreadEntity>;

  /**
   * Validates thread title
   * Ensures title is not empty and within length limits
   *
   * @param title Thread title to validate
   * @throws {InvalidTitleError} When validation fails
   */
  validateThreadTitle(title: string): void;

  /**
   * Deletes a chat thread
   *
   * @param threadId ID of the thread to delete
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {ForbiddenError} When user does not own the thread
   * @returns Promise resolving when thread is deleted successfully
   */
  deleteThread(threadId: string): Promise<void>;

  /**
   * Updates the model used in a chat thread
   *
   * @param params The parameters for updating the thread model
   * @throws {UnauthorizedError} When user is not authenticated
   * @throws {ThreadNotFoundError} When thread is not found
   * @throws {ModelNotFoundError} When model is not found or unavailable
   * @throws {ForbiddenError} When user does not own the thread
   * @returns Promise resolving to the updated thread entity
   */
  updateThreadModel(params: UpdateThreadModelParams): Promise<ChatThreadEntity>;
}
