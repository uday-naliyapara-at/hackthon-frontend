/**
 * Chat domain types and interfaces
 */

/**
 * Base interface for all message content types with common properties
 */
export interface BaseMessageContent {
  type: string;
  timestamp: Date;
}

/**
 * Text content within a message
 */
export interface TextContent extends BaseMessageContent {
  type: 'text';
  text: string;
}

/**
 * Tool call content within a message (when a tool is being called)
 */
export interface ToolCallContent extends BaseMessageContent {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

/**
 * Tool result content within a message (result from a tool call)
 */
export interface ToolResultContent extends BaseMessageContent {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: Record<string, unknown>;
}

/**
 * Union type for all possible message content types
 */
export type MessageContent = TextContent | ToolCallContent | ToolResultContent;

/**
 * Represents a chat message in the system
 * A message always belongs to a thread, even if the thread was created implicitly
 */
export interface ChatMessage {
  id: string;
  content: MessageContent[];
  threadId: string; // Required in response as message always belongs to a thread
  timestamp: Date;
  role: 'user' | 'assistant'; // Indicates whether the message is from a user or AI assistant
  modelId?: string; // ID of the model used (primarily for assistant messages)
  traceId?: string; // Trace ID for tracking message generation
  replacedBy?: string; // ID of the message that replaced this one (if edited)
  replacedMessageId?: string; // ID of the message this one replaces (if this is an edited version)
  userMessageId?: string; // ID of the user message that triggered this assistant message
}

/**
 * Represents a chat thread in the system
 * A thread contains multiple messages and is associated with a specific AI model
 */
export interface ChatThread {
  id: string;
  title: string;
  modelId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request parameters for sending a chat message
 * threadId is optional - if not provided, a new thread will be created
 */
export interface SendMessageParams {
  threadId?: string; // Optional - new thread will be created if not provided
  modelId: string;
  message: string;
}

/**
 * Request parameters for editing a chat message
 * When a message is edited, all subsequent messages in the thread will be deleted
 */
export interface EditMessageParams {
  threadId: string;
  messageId: string;
  content: string;
  modelId: string;
}

/**
 * Error codes specific to chat operations
 */
export enum ChatErrorCode {
  INVALID_MESSAGE = 'CHAT_001',
  THREAD_NOT_FOUND = 'CHAT_002',
  MODEL_NOT_FOUND = 'CHAT_003',
  MODEL_NOT_ENABLED = 'CHAT_004',
  RATE_LIMIT_EXCEEDED = 'CHAT_005',
  MESSAGE_NOT_FOUND = 'CHAT_006',
  INVALID_TITLE = 'CHAT_007',
  SERVER_ERROR = 'CHAT_500',
}

export interface FeedbackParams {
  messageId: string;
  rating: 'positive' | 'negative';
  comment?: string;
}

/**
 * Request parameters for renaming a chat thread
 */
export interface RenameThreadParams {
  threadId: string;
  newTitle: string;
}

/**
 * Request parameters for updating the model used in a chat thread
 */
export interface UpdateThreadModelParams {
  threadId: string;
  modelId: string;
}
