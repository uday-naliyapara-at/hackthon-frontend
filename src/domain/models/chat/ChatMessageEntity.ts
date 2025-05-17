import {
  ChatMessage,
  MessageContent,
  TextContent,
  ToolCallContent,
  ToolResultContent,
} from './types';

// Type predicates for message content types
function isTextContent(content: MessageContent): content is TextContent {
  return content.type === 'text';
}

/**
 * Entity representing a chat message in the system
 * Implements domain validation and business rules for chat messages
 * Note: This entity represents a stored/response message, where threadId is always required
 * For sending messages, use SendMessageParams which has optional threadId
 */
export class ChatMessageEntity implements ChatMessage {
  private readonly _modelId?: string;
  private readonly _traceId?: string;
  private readonly _replacedBy?: string;
  private readonly _replacedMessageId?: string;
  private readonly _userMessageId?: string;

  constructor(
    private readonly _id: string,
    private readonly _content: MessageContent[],
    private readonly _threadId: string,
    private readonly _timestamp: Date,
    private readonly _role: 'user' | 'assistant',
    options?: {
      modelId?: string;
      traceId?: string;
      replacedBy?: string;
      replacedMessageId?: string;
      userMessageId?: string;
    }
  ) {
    this._modelId = options?.modelId;
    this._traceId = options?.traceId;
    this._replacedBy = options?.replacedBy;
    this._replacedMessageId = options?.replacedMessageId;
    this._userMessageId = options?.userMessageId;
    this.validateState();
  }

  // Getters for immutable properties
  get id(): string {
    return this._id;
  }

  get content(): MessageContent[] {
    return [...this._content]; // Return a copy to maintain immutability
  }

  get threadId(): string {
    return this._threadId;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get role(): 'user' | 'assistant' {
    return this._role;
  }

  get modelId(): string | undefined {
    return this._modelId;
  }

  get traceId(): string | undefined {
    return this._traceId;
  }

  get replacedBy(): string | undefined {
    return this._replacedBy;
  }

  get replacedMessageId(): string | undefined {
    return this._replacedMessageId;
  }

  get userMessageId(): string | undefined {
    return this._userMessageId;
  }

  /**
   * Factory method to create a new ChatMessageEntity
   * @throws Error if required fields are missing or invalid
   */
  static create(params: {
    id: string;
    content: MessageContent[];
    threadId: string; // Required for stored messages
    timestamp: Date;
    role: 'user' | 'assistant';
    modelId?: string;
    traceId?: string;
    replacedBy?: string;
    replacedMessageId?: string;
    userMessageId?: string;
  }): ChatMessageEntity {
    return new ChatMessageEntity(
      params.id,
      params.content,
      params.threadId,
      params.timestamp,
      params.role,
      {
        modelId: params.modelId,
        traceId: params.traceId,
        replacedBy: params.replacedBy,
        replacedMessageId: params.replacedMessageId,
        userMessageId: params.userMessageId,
      }
    );
  }

  /**
   * Helper method to create a simple text message
   */
  static createSimpleTextMessage(params: {
    id: string;
    text: string;
    threadId: string;
    timestamp: Date;
    role: 'user' | 'assistant';
    modelId?: string;
  }): ChatMessageEntity {
    const textContent: TextContent = {
      type: 'text',
      text: params.text,
      timestamp: params.timestamp,
    };

    return ChatMessageEntity.create({
      id: params.id,
      content: [textContent],
      threadId: params.threadId,
      timestamp: params.timestamp,
      role: params.role,
      modelId: params.modelId,
    });
  }

  /**
   * Extracts plain text content from the message
   * Useful for displaying a simple text representation of complex messages
   * @returns Concatenated text content from all text blocks
   */
  getPlainTextContent(): string {
    return this._content
      .filter(isTextContent)
      .map((item) => item.text)
      .join(' ');
  }

  /**
   * Validates message content according to business rules
   * @throws Error if content is invalid
   */
  static validateMessageContent(content: MessageContent[]): void {
    if (!content || !Array.isArray(content) || content.length === 0) {
      throw new Error('Message content cannot be empty');
    }

    // Validate each content item has the required properties
    content.forEach((item) => {
      if (!item.timestamp) {
        throw new Error('Content item must have a timestamp');
      }

      // Type-specific validation based on discriminated union
      if (item.type === 'text') {
        if (!item.text || typeof item.text !== 'string' || item.text.trim().length === 0) {
          throw new Error('Text content must have non-empty text');
        }
      } else if (item.type === 'tool-call') {
        if (!item.toolCallId) {
          throw new Error('Tool call content must have a toolCallId');
        }
        if (!item.toolName) {
          throw new Error('Tool call content must have a toolName');
        }
        if (!item.args) {
          throw new Error('Tool call content must have args');
        }
      } else if (item.type === 'tool-result') {
        if (!item.toolCallId) {
          throw new Error('Tool result content must have a toolCallId');
        }
        if (!item.toolName) {
          throw new Error('Tool result content must have a toolName');
        }
        if (!item.result) {
          throw new Error('Tool result content must have a result');
        }
      } else {
        // Type never if we've covered all possible types
        const exhaustiveCheck: never = item;
        throw new Error(`Unknown content type: ${(exhaustiveCheck as any).type}`);
      }
    });
  }

  /**
   * Validates the state of the chat message
   * @throws Error if validation fails
   */
  private validateState(): void {
    if (!this._id) {
      throw new Error('Message ID is required');
    }

    // Use shared content validation
    ChatMessageEntity.validateMessageContent(this._content);

    if (!this._threadId) {
      throw new Error('Thread ID is required for stored messages');
    }
    if (!this._timestamp) {
      throw new Error('Timestamp is required');
    }
    if (!this._role) {
      throw new Error('Message role is required');
    }
    if (this._role !== 'user' && this._role !== 'assistant') {
      throw new Error('Message role must be either "user" or "assistant"');
    }
  }

  /**
   * Returns a plain object representation of the chat message
   */
  toJSON(): ChatMessage {
    return {
      id: this._id,
      content: this._content,
      threadId: this._threadId,
      timestamp: this._timestamp,
      role: this._role,
      ...(this._modelId && { modelId: this._modelId }),
      ...(this._traceId && { traceId: this._traceId }),
      ...(this._replacedBy && { replacedBy: this._replacedBy }),
      ...(this._replacedMessageId && { replacedMessageId: this._replacedMessageId }),
      ...(this._userMessageId && { userMessageId: this._userMessageId }),
    };
  }

  /**
   * Creates a new instance with edited content
   * @param newTextContent New text content for the message
   * @returns A new ChatMessageEntity with updated content and timestamp
   * @throws Error if content is invalid
   */
  edit(newTextContent: string): ChatMessageEntity {
    const now = new Date();

    // Create a new text content block
    const textContent: TextContent = {
      type: 'text',
      text: newTextContent,
      timestamp: now,
    };

    // Validate the new content
    ChatMessageEntity.validateMessageContent([textContent]);

    // Return new instance with updated content and timestamp
    return new ChatMessageEntity(
      this._id,
      [textContent], // Replace with the new content
      this._threadId,
      now, // Update timestamp to reflect edit time
      this._role,
      {
        modelId: this._modelId,
        traceId: this._traceId,
        replacedBy: this._replacedBy,
        replacedMessageId: this._replacedMessageId,
        userMessageId: this._userMessageId,
      }
    );
  }

  /**
   * Creates a new instance with completely replaced content
   * @param newContent New content array for the message
   * @returns A new ChatMessageEntity with updated content and timestamp
   * @throws Error if content is invalid
   */
  replaceContent(newContent: MessageContent[]): ChatMessageEntity {
    // Validate the new content
    ChatMessageEntity.validateMessageContent(newContent);

    // Return new instance with updated content and timestamp
    return new ChatMessageEntity(
      this._id,
      newContent,
      this._threadId,
      new Date(), // Update timestamp to reflect edit time
      this._role,
      {
        modelId: this._modelId,
        traceId: this._traceId,
        replacedBy: this._replacedBy,
        replacedMessageId: this._replacedMessageId,
        userMessageId: this._userMessageId,
      }
    );
  }

  /**
   * Convert a string message to a structured message with text content
   * Useful for backward compatibility with APIs that only accept/return string content
   * @param message Simple string message
   * @returns Structured message content array with a single text block
   */
  static stringToContentArray(message: string, timestamp = new Date()): MessageContent[] {
    if (!message || message.trim().length === 0) {
      throw new Error('Message text cannot be empty');
    }

    return [
      {
        type: 'text',
        text: message,
        timestamp,
      },
    ];
  }
}
