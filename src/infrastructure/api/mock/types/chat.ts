export interface TextContent {
  type: 'text';
  text: string;
  timestamp: string;
}

export interface ToolCallContent {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  timestamp: string;
}

export interface ToolResultContent {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: Record<string, unknown>;
  timestamp: string;
}

export type MessageContent = TextContent | ToolCallContent | ToolResultContent;

export interface ChatMessage {
  id: string;
  content: MessageContent[];
  threadId: string;
  timestamp: string;
  role: 'user' | 'assistant'; // Indicates whether the message is from a user or AI
  modelId?: string;
  traceId?: string;
  replacedBy?: string;
  replacedMessageId?: string;
  userMessageId?: string;
}

export interface SendMessageRequest {
  threadId?: string;
  modelId: string;
  message: string;
}

export interface ChatThread {
  id: string;
  title: string;
  modelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Error codes for chat-related errors
export enum ChatErrorCode {
  INVALID_MESSAGE = 'CHAT_001',
  THREAD_NOT_FOUND = 'CHAT_002',
  MODEL_NOT_FOUND = 'CHAT_003',
  MODEL_NOT_ENABLED = 'CHAT_004',
  RATE_LIMIT_EXCEEDED = 'CHAT_005',
  MESSAGE_NOT_FOUND = 'CHAT_006',
}

/**
 * Interface for feedback request
 */
export interface FeedbackRequest {
  messageId: string;
  rating: 'positive' | 'negative';
  comment?: string;
}

/**
 * Interface for feedback response
 */
export interface FeedbackResponse {
  message: string;
}
